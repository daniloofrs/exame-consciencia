import XCTest
@testable import ExameConsciencia

@MainActor
final class ExaminationStoreTests: XCTestCase {
    private func makeTestContext() throws -> (tempDir: URL, defaults: UserDefaults) {
        let tempDir = FileManager.default.temporaryDirectory
            .appendingPathComponent("ExameConscienciaTests-\(UUID().uuidString)", isDirectory: true)
        try FileManager.default.createDirectory(at: tempDir, withIntermediateDirectories: true)
        let suiteName = "com.daniloofrs.exameconsciencia.tests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suiteName)!
        return (tempDir, defaults)
    }

    func testLoadsCatalogFromBundle() throws {
        let ctx = try makeTestContext()
        let store = ExaminationStore(storageDirectory: ctx.tempDir, userDefaults: ctx.defaults)
        XCTAssertFalse(store.catalog.categories.isEmpty)
        XCTAssertGreaterThanOrEqual(store.catalog.categories.count, 13)
        XCTAssertGreaterThanOrEqual(store.catalog.prayers.count, 2)
    }

    func testToggleQuestionAndUnmarkClearsNoteAndConfessedState() throws {
        let ctx = try makeTestContext()
        let store = ExaminationStore(storageDirectory: ctx.tempDir, userDefaults: ctx.defaults)
        store.toggleQuestion("cmd1_q1")
        store.updateNote(for: "cmd1_q1", note: "Duas vezes")
        store.toggleConfessedItem("cmd1_q1")

        XCTAssertTrue(store.selectedQuestionIDs.contains("cmd1_q1"))
        XCTAssertEqual(store.questionNotes["cmd1_q1"], "Duas vezes")
        XCTAssertTrue(store.confessedItemIDs.contains("cmd1_q1"))

        store.toggleQuestion("cmd1_q1")
        XCTAssertFalse(store.selectedQuestionIDs.contains("cmd1_q1"))
        XCTAssertNil(store.questionNotes["cmd1_q1"])
        XCTAssertFalse(store.confessedItemIDs.contains("cmd1_q1"))
    }

    func testWhitespaceOnlyNotesAndCustomEntriesAreIgnored() throws {
        let ctx = try makeTestContext()
        let store = ExaminationStore(storageDirectory: ctx.tempDir, userDefaults: ctx.defaults)
        store.toggleQuestion("cmd1_q1")
        store.updateNote(for: "cmd1_q1", note: "   \n  ")
        store.addCustomEntry("   \t ")

        XCTAssertNil(store.questionNotes["cmd1_q1"])
        XCTAssertTrue(store.customEntries.isEmpty)
    }

    func testDraftPersistenceAndExpirationAfter24Hours() throws {
        let ctx = try makeTestContext()
        let baseTime = Date(timeIntervalSince1970: 1_700_000_000)
        let store1 = ExaminationStore(
            storageDirectory: ctx.tempDir,
            userDefaults: ctx.defaults,
            nowProvider: { baseTime }
        )
        store1.toggleQuestion("cmd3_q1")
        store1.addCustomEntry("Falta de caridade no trabalho")

        let store2 = ExaminationStore(
            storageDirectory: ctx.tempDir,
            userDefaults: ctx.defaults,
            nowProvider: { baseTime.addingTimeInterval(3600) }
        )
        XCTAssertEqual(store2.selectedQuestionIDs, ["cmd3_q1"])
        XCTAssertEqual(store2.customEntries.count, 1)
        XCTAssertEqual(store2.customEntries.first?.text, "Falta de caridade no trabalho")

        let storeExpired = ExaminationStore(
            storageDirectory: ctx.tempDir,
            userDefaults: ctx.defaults,
            nowProvider: { baseTime.addingTimeInterval(90_000) }
        )
        XCTAssertTrue(storeExpired.selectedQuestionIDs.isEmpty)
        XCTAssertTrue(storeExpired.customEntries.isEmpty)
    }

    func testCorruptedDraftFileIsDiscardedGracefully() throws {
        let ctx = try makeTestContext()
        let draftURL = ctx.tempDir.appendingPathComponent("active_draft.json")
        try Data("{ invalid json".utf8).write(to: draftURL)

        let store = ExaminationStore(storageDirectory: ctx.tempDir, userDefaults: ctx.defaults)
        XCTAssertTrue(store.selectedQuestionIDs.isEmpty)
        XCTAssertTrue(store.customEntries.isEmpty)
        XCTAssertFalse(FileManager.default.fileExists(atPath: draftURL.path))
    }

    func testCompleteAbsolutionWipesAllSinsAndRecordsTimestamp() throws {
        let ctx = try makeTestContext()
        let fixedNow = Date(timeIntervalSince1970: 1_700_050_000)
        let store = ExaminationStore(
            storageDirectory: ctx.tempDir,
            userDefaults: ctx.defaults,
            nowProvider: { fixedNow }
        )
        store.toggleQuestion("cmd1_q1")
        store.updateNote(for: "cmd1_q1", note: "Nota secreta")
        store.addCustomEntry("Falta avulsa")

        XCTAssertEqual(store.totalSelectedCount, 2)
        store.completeAbsolution()

        XCTAssertTrue(store.selectedQuestionIDs.isEmpty)
        XCTAssertTrue(store.questionNotes.isEmpty)
        XCTAssertTrue(store.customEntries.isEmpty)
        XCTAssertTrue(store.confessedItemIDs.isEmpty)
        XCTAssertEqual(store.totalSelectedCount, 0)
        XCTAssertEqual(store.lastConfessionDate, fixedNow)

        let draftURL = ctx.tempDir.appendingPathComponent("active_draft.json")
        XCTAssertFalse(FileManager.default.fileExists(atPath: draftURL.path))
    }

    func testDaysSinceLastConfessionCalculation() throws {
        let ctx = try makeTestContext()
        let confessionDate = Date(timeIntervalSince1970: 1_700_000_000)
        let tenDaysLater = confessionDate.addingTimeInterval(10 * 86_400)
        let store = ExaminationStore(
            storageDirectory: ctx.tempDir,
            userDefaults: ctx.defaults,
            nowProvider: { confessionDate }
        )
        XCTAssertNil(store.daysSinceLastConfession(referenceDate: tenDaysLater))

        store.completeAbsolution()
        XCTAssertEqual(store.daysSinceLastConfession(referenceDate: tenDaysLater), 10)
    }
}
