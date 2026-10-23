import Foundation

public struct ExaminationCatalog: Codable, Equatable, Sendable {
    public let prayers: [PrayerItem]
    public let categories: [ExaminationCategory]

    public init(prayers: [PrayerItem], categories: [ExaminationCategory]) {
        self.prayers = prayers
        self.categories = categories
    }
}

public struct PrayerItem: Codable, Identifiable, Equatable, Sendable {
    public let id: String
    public let title: String
    public let subtitle: String
    public let body: String

    public init(id: String, title: String, subtitle: String, body: String) {
        self.id = id
        self.title = title
        self.subtitle = subtitle
        self.body = body
    }
}

public struct ExaminationCategory: Codable, Identifiable, Equatable, Sendable {
    public let id: String
    public let title: String
    public let subtitle: String
    public let symbolName: String
    public let questions: [ExaminationQuestion]

    public init(
        id: String,
        title: String,
        subtitle: String,
        symbolName: String,
        questions: [ExaminationQuestion]
    ) {
        self.id = id
        self.title = title
        self.subtitle = subtitle
        self.symbolName = symbolName
        self.questions = questions
    }
}

public struct ExaminationQuestion: Codable, Identifiable, Equatable, Sendable {
    public let id: String
    public let commandmentLabel: String
    public let text: String

    public init(id: String, commandmentLabel: String, text: String) {
        self.id = id
        self.commandmentLabel = commandmentLabel
        self.text = text
    }
}

public struct CustomSinEntry: Codable, Identifiable, Equatable, Sendable {
    public let id: UUID
    public var text: String
    public let createdAt: Date

    public init(id: UUID = UUID(), text: String, createdAt: Date = Date()) {
        self.id = id
        self.text = text
        self.createdAt = createdAt
    }
}

public struct DraftSession: Codable, Equatable, Sendable {
    public var selectedQuestionIDs: Set<String>
    public var questionNotes: [String: String]
    public var customEntries: [CustomSinEntry]
    public var confessedItemIDs: Set<String>
    public var updatedAt: Date

    public init(
        selectedQuestionIDs: Set<String> = [],
        questionNotes: [String: String] = [:],
        customEntries: [CustomSinEntry] = [],
        confessedItemIDs: Set<String> = [],
        updatedAt: Date = Date()
    ) {
        self.selectedQuestionIDs = selectedQuestionIDs
        self.questionNotes = questionNotes
        self.customEntries = customEntries
        self.confessedItemIDs = confessedItemIDs
        self.updatedAt = updatedAt
    }
}
