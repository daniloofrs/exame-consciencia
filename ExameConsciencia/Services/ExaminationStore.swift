import Foundation
import Observation

@Observable
@MainActor
public final class ExaminationStore {
    public private(set) var catalog: ExaminationCatalog
    public private(set) var selectedQuestionIDs: Set<String> = []
    public private(set) var questionNotes: [String: String] = [:]
    public private(set) var customEntries: [CustomSinEntry] = []
    public private(set) var confessedItemIDs: Set<String> = []

    public var lastConfessionDate: Date? {
        didSet {
            if let lastConfessionDate {
                userDefaults.set(lastConfessionDate.timeIntervalSince1970, forKey: Self.lastConfessionKey)
            } else {
                userDefaults.removeObject(forKey: Self.lastConfessionKey)
            }
        }
    }

    public var totalSelectedCount: Int {
        selectedQuestionIDs.count + customEntries.count
    }

    public var markedQuestions: [ExaminationQuestion] {
        catalog.categories
            .flatMap(\.questions)
            .filter { selectedQuestionIDs.contains($0.id) }
    }

    private static let lastConfessionKey = "com.daniloofrs.exameconsciencia.lastConfessionTimestamp"
    private static let draftFilename = "active_draft.json"
    private static let draftExpirationInterval: TimeInterval = 86_400

    private let storageDirectory: URL
    private let userDefaults: UserDefaults
    private let nowProvider: () -> Date

    public init(
        storageDirectory: URL? = nil,
        userDefaults: UserDefaults = .standard,
        nowProvider: @escaping () -> Date = Date.init
    ) {
        self.userDefaults = userDefaults
        self.nowProvider = nowProvider

        if let storageDirectory {
            self.storageDirectory = storageDirectory
        } else {
            let baseDir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first
                ?? FileManager.default.temporaryDirectory
            let appDir = baseDir.appendingPathComponent("ExameConsciencia", isDirectory: true)
            try? FileManager.default.createDirectory(at: appDir, withIntermediateDirectories: true)
            self.storageDirectory = appDir
        }

        self.catalog = Self.loadCatalog()

        if userDefaults.object(forKey: Self.lastConfessionKey) != nil {
            let timestamp = userDefaults.double(forKey: Self.lastConfessionKey)
            self.lastConfessionDate = Date(timeIntervalSince1970: timestamp)
        } else {
            self.lastConfessionDate = nil
        }

        restoreDraftIfValid()
    }

    public func isQuestionSelected(_ questionID: String) -> Bool {
        selectedQuestionIDs.contains(questionID)
    }

    public func toggleQuestion(_ questionID: String) {
        if selectedQuestionIDs.contains(questionID) {
            selectedQuestionIDs.remove(questionID)
            questionNotes.removeValue(forKey: questionID)
            confessedItemIDs.remove(questionID)
        } else {
            selectedQuestionIDs.insert(questionID)
        }
        persistDraft()
    }

    public func note(for questionID: String) -> String {
        questionNotes[questionID] ?? ""
    }

    public func updateNote(for questionID: String, note: String) {
        let trimmed = note.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            questionNotes.removeValue(forKey: questionID)
        } else {
            if !selectedQuestionIDs.contains(questionID) {
                selectedQuestionIDs.insert(questionID)
            }
            questionNotes[questionID] = trimmed
        }
        persistDraft()
    }

    public func addCustomEntry(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        let entry = CustomSinEntry(text: trimmed, createdAt: nowProvider())
        customEntries.append(entry)
        persistDraft()
    }

    public func removeCustomEntry(id: UUID) {
        customEntries.removeAll { $0.id == id }
        confessedItemIDs.remove(id.uuidString)
        persistDraft()
    }

    public func isItemConfessed(_ itemID: String) -> Bool {
        confessedItemIDs.contains(itemID)
    }

    public func toggleConfessedItem(_ itemID: String) {
        if confessedItemIDs.contains(itemID) {
            confessedItemIDs.remove(itemID)
        } else {
            confessedItemIDs.insert(itemID)
        }
        persistDraft()
    }

    public func completeAbsolution() {
        discardCurrentDraft()
        lastConfessionDate = nowProvider()
    }

    public func discardCurrentDraft() {
        selectedQuestionIDs.removeAll()
        questionNotes.removeAll()
        customEntries.removeAll()
        confessedItemIDs.removeAll()
        removeDraftFile()
    }

    public func daysSinceLastConfession(referenceDate: Date = Date()) -> Int? {
        guard let lastConfessionDate else { return nil }
        let seconds = max(0, referenceDate.timeIntervalSince(lastConfessionDate))
        return Int(seconds / 86_400)
    }

    public func prayer(withID id: String) -> PrayerItem? {
        catalog.prayers.first { $0.id == id }
    }

    // MARK: - Private Helpers

    private var draftFileURL: URL {
        storageDirectory.appendingPathComponent(Self.draftFilename)
    }

    private func restoreDraftIfValid() {
        let url = draftFileURL
        guard FileManager.default.fileExists(atPath: url.path) else { return }
        do {
            let data = try Data(contentsOf: url)
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            let draft = try decoder.decode(DraftSession.self, from: data)
            let age = nowProvider().timeIntervalSince(draft.updatedAt)
            if age > Self.draftExpirationInterval {
                removeDraftFile()
                return
            }
            self.selectedQuestionIDs = draft.selectedQuestionIDs
            self.questionNotes = draft.questionNotes
            self.customEntries = draft.customEntries
            self.confessedItemIDs = draft.confessedItemIDs
        } catch {
            removeDraftFile()
        }
    }

    private func persistDraft() {
        if selectedQuestionIDs.isEmpty && questionNotes.isEmpty && customEntries.isEmpty {
            removeDraftFile()
            return
        }
        let draft = DraftSession(
            selectedQuestionIDs: selectedQuestionIDs,
            questionNotes: questionNotes,
            customEntries: customEntries,
            confessedItemIDs: confessedItemIDs,
            updatedAt: nowProvider()
        )
        do {
            try FileManager.default.createDirectory(at: storageDirectory, withIntermediateDirectories: true)
            let encoder = JSONEncoder()
            encoder.dateEncodingStrategy = .iso8601
            let data = try encoder.encode(draft)
            try data.write(to: draftFileURL, options: [.atomic, .completeFileProtection])
        } catch {
            // Best effort sandbox write
        }
    }

    private func removeDraftFile() {
        let url = draftFileURL
        if FileManager.default.fileExists(atPath: url.path) {
            try? FileManager.default.removeItem(at: url)
        }
    }

    private static func loadCatalog() -> ExaminationCatalog {
        let bundles = [Bundle.main, Bundle(for: BundleToken.self)]
        for bundle in bundles {
            if let url = bundle.url(forResource: "examination_catalog", withExtension: "json"),
               let data = try? Data(contentsOf: url),
               let decoded = try? JSONDecoder().decode(ExaminationCatalog.self, from: data) {
                return decoded
            }
        }
        return ExaminationCatalog(prayers: [], categories: [])
    }
}

private final class BundleToken {}
