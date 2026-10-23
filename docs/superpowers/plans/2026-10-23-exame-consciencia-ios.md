# Exame de Consciência iOS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 100% offline native iOS app in Swift 6 and SwiftUI for a Catholic Examination of Conscience with "Liquid Glass" (Candlelight / Luz de Vela) aesthetics, custom sin notes, confessional summary mode, and immediate post-absolution data destruction that preserves only the last confession timestamp.

**Architecture:** A modular SwiftUI application using `@Observable` state management (`ExaminationStore`), a static bundled JSON doctrinal catalog (`examination_catalog.json`), hardware-encrypted temporary draft persistence (`FileProtectionType.complete`) during an active examination, `UserDefaults` storage exclusively for `lastConfessionDate`, and an XcodeGen + GitHub Actions macOS pipeline to compile and package the `.ipa`.

**Tech Stack:** Swift 6.0, SwiftUI (iOS 18.0+), Foundation, Local Haptics (`UIKit.UIImpactFeedbackGenerator`), XCTest, XcodeGen (`project.yml`), GitHub Actions (`macos-15`).

**Spec:** `docs/superpowers/specs/2026-10-23-exame-consciencia-ios-design.md`

## Global Constraints

- Platform target: iOS 18.0+, Swift 6.0, 100% native SwiftUI (no PWA, no WebViews).
- Zero network calls, zero third-party SDKs, zero analytics/telemetry.
- Visual style: "Liquid Glass" with "Luz de Vela" palette (Obsidian `#07080D`, Amber `#F59E0B`, Bronze `#D97706`, `.ultraThinMaterial` translucency, refractive top-edge highlight).
- Post-confession behavior (Option B): Tapping "Recebi a Absolvição" permanently erases all marked questions, contextual notes, custom entries, and temporary draft files from disk, storing only `lastConfessionDate: Date` in `UserDefaults`.
- App Switcher privacy: When `scenePhase != .active`, overlay a full-screen blurred privacy shield so sensitive notes are never visible in the iOS app switcher.

## Review Focus

- Whitespace-only custom sin entries or notes: Adding a custom sin or note containing only spaces/newlines (`"   \n "`) must be ignored/trimmed so empty cards never appear in the confessional view.
- Corrupted or stale draft file on launch: If the temporary draft JSON cannot be decoded or is older than 24 hours, `ExaminationStore` must discard it cleanly without crashing and start a fresh session.
- App termination while waiting in the confessional line: Mutations to selected questions, notes, or custom sins must immediately persist to the encrypted draft file so reopening the app restores the exact state.
- First-time user with `lastConfessionDate == nil`: The confessional greeting and home card must gracefully display `"Primeira vez usando o app"` (and allow manual date selection) instead of crashing or showing `0 dias`.
- Re-tapping an already-marked question: Unmarking a question must also clear its associated note and `confessedItemIDs` entry so orphaned notes never reappear.

---

### Task 1: Project Configuration, Models & Doctrinal Catalog

**Files:**
- Create: `project.yml`
- Create: `ExameConsciencia/Models/ExaminationModels.swift`
- Create: `ExameConsciencia/Resources/examination_catalog.json`
- Create: `scripts/validate-project.mjs`

**Interfaces:**
- Consumes: none
- Produces:
  - `struct ExaminationCatalog: Codable, Sendable` (`prayers: [PrayerItem]`, `categories: [ExaminationCategory]`)
  - `struct PrayerItem: Codable, Identifiable, Equatable, Sendable` (`id: String`, `title: String`, `subtitle: String`, `body: String`)
  - `struct ExaminationCategory: Codable, Identifiable, Equatable, Sendable` (`id: String`, `title: String`, `subtitle: String`, `symbolName: String`, `questions: [ExaminationQuestion]`)
  - `struct ExaminationQuestion: Codable, Identifiable, Equatable, Sendable` (`id: String`, `commandmentLabel: String`, `text: String`)
  - `struct CustomSinEntry: Codable, Identifiable, Equatable, Sendable` (`id: UUID`, `text: String`, `createdAt: Date`)
  - `struct DraftSession: Codable, Equatable, Sendable` (`selectedQuestionIDs: Set<String>`, `questionNotes: [String: String]`, `customEntries: [CustomSinEntry]`, `confessedItemIDs: Set<String>`, `updatedAt: Date`)

- [ ] **Step 1: Create `scripts/validate-project.mjs` to validate JSON catalog schema and required project files on Windows**

```javascript
import fs from 'fs';
const catalog = JSON.parse(fs.readFileSync('ExameConsciencia/Resources/examination_catalog.json', 'utf8'));
if (!Array.isArray(catalog.prayers) || catalog.prayers.length < 2) throw new Error('Missing prayers');
if (!Array.isArray(catalog.categories) || catalog.categories.length < 13) throw new Error('Expected at least 13 categories (10 commandments + precepts + capital sins + state duties)');
console.log('Catalog validation passed:', catalog.categories.length, 'categories');
```

- [ ] **Step 2: Run validation script to verify it fails before files exist**

Run: `node scripts/validate-project.mjs`
Expected: FAIL with `ENOENT: no such file or directory`

- [ ] **Step 3: Create `project.yml`, `ExameConsciencia/Models/ExaminationModels.swift`, and `ExameConsciencia/Resources/examination_catalog.json`**

Define XcodeGen targets `ExameConsciencia` (application, iOS 18.0, bundle id `com.daniloofrs.exameconsciencia`, portrait orientation, dark appearance) and `ExameConscienciaTests` (unit test bundle). Populate `examination_catalog.json` with traditional Catholic prayers (`espirito-santo`, `ato-contricao`) and complete questions across the 10 Commandments, 5 Precepts of the Church, 7 Capital Sins, and Duties of State.

- [ ] **Step 4: Run validation script to verify it passes**

Run: `node scripts/validate-project.mjs`
Expected: PASS with `Catalog validation passed`

- [ ] **Step 5: Commit**

```bash
git add project.yml ExameConsciencia/Models/ExaminationModels.swift ExameConsciencia/Resources/examination_catalog.json scripts/validate-project.mjs
git commit -m "feat: add XcodeGen config, domain models, and Catholic doctrinal catalog"
```

---

### Task 2: ExaminationStore State, Encrypted Draft Lifecycle & Unit Tests

**Files:**
- Create: `ExameConsciencia/Services/ExaminationStore.swift`
- Create: `ExameConscienciaTests/ExaminationStoreTests.swift`
- Modify: `scripts/validate-project.mjs`

**Interfaces:**
- Consumes: `ExaminationCatalog`, `ExaminationCategory`, `ExaminationQuestion`, `CustomSinEntry`, `DraftSession` from Task 1
- Produces:
  - `@Observable @MainActor final class ExaminationStore`:
    - `init(storageDirectory: URL? = nil, userDefaults: UserDefaults = .standard, nowProvider: @escaping () -> Date = Date.init)`
    - `private(set) var catalog: ExaminationCatalog`
    - `private(set) var selectedQuestionIDs: Set<String>`
    - `private(set) var questionNotes: [String: String]`
    - `private(set) var customEntries: [CustomSinEntry]`
    - `private(set) var confessedItemIDs: Set<String>`
    - `var lastConfessionDate: Date?`
    - `var totalSelectedCount: Int { get }`
    - `func toggleQuestion(_ questionID: String)`
    - `func updateNote(for questionID: String, note: String)`
    - `func addCustomEntry(_ text: String)`
    - `func removeCustomEntry(id: UUID)`
    - `func toggleConfessedItem(_ itemID: String)`
    - `func completeAbsolution()`
    - `func discardCurrentDraft()`
    - `func daysSinceLastConfession(referenceDate: Date = Date()) -> Int?`

- [ ] **Step 1: Write unit tests in `ExameConscienciaTests/ExaminationStoreTests.swift`**

```swift
@MainActor
final class ExaminationStoreTests: XCTestCase {
    func testToggleQuestionAndUnmarkClearsNoteAndConfessedState() throws {
        let store = ExaminationStore(storageDirectory: tempDir, userDefaults: testDefaults)
        store.toggleQuestion("cmd1_q1")
        store.updateNote(for: "cmd1_q1", note: "Duas vezes")
        store.toggleConfessedItem("cmd1_q1")
        XCTAssertTrue(store.selectedQuestionIDs.contains("cmd1_q1"))
        store.toggleQuestion("cmd1_q1")
        XCTAssertFalse(store.selectedQuestionIDs.contains("cmd1_q1"))
        XCTAssertNil(store.questionNotes["cmd1_q1"])
        XCTAssertFalse(store.confessedItemIDs.contains("cmd1_q1"))
    }

    func testWhitespaceOnlyNotesAndCustomEntriesAreIgnored() throws {
        let store = ExaminationStore(storageDirectory: tempDir, userDefaults: testDefaults)
        store.toggleQuestion("cmd1_q1")
        store.updateNote(for: "cmd1_q1", note: "   \n  ")
        store.addCustomEntry("   \t ")
        XCTAssertNil(store.questionNotes["cmd1_q1"])
        XCTAssertTrue(store.customEntries.isEmpty)
    }

    func testDraftPersistenceAndExpirationAfter24Hours() throws {
        var currentTime = Date(timeIntervalSince1970: 1_700_000_000)
        let store1 = ExaminationStore(storageDirectory: tempDir, userDefaults: testDefaults, nowProvider: { currentTime })
        store1.toggleQuestion("cmd3_q1")
        store1.addCustomEntry("Falta de caridade no trabalho")

        let store2 = ExaminationStore(storageDirectory: tempDir, userDefaults: testDefaults, nowProvider: { currentTime.addingTimeInterval(3600) })
        XCTAssertEqual(store2.selectedQuestionIDs, ["cmd3_q1"])
        XCTAssertEqual(store2.customEntries.count, 1)

        let storeExpired = ExaminationStore(storageDirectory: tempDir, userDefaults: testDefaults, nowProvider: { currentTime.addingTimeInterval(90_000) })
        XCTAssertTrue(storeExpired.selectedQuestionIDs.isEmpty)
        XCTAssertTrue(storeExpired.customEntries.isEmpty)
    }

    func testCompleteAbsolutionWipesAllSinsAndRecordsTimestamp() throws {
        let fixedNow = Date(timeIntervalSince1970: 1_700_050_000)
        let store = ExaminationStore(storageDirectory: tempDir, userDefaults: testDefaults, nowProvider: { fixedNow })
        store.toggleQuestion("cmd1_q1")
        store.updateNote(for: "cmd1_q1", note: "Nota secreta")
        store.addCustomEntry("Falta avulsa")
        store.completeAbsolution()
        XCTAssertTrue(store.selectedQuestionIDs.isEmpty)
        XCTAssertTrue(store.questionNotes.isEmpty)
        XCTAssertTrue(store.customEntries.isEmpty)
        XCTAssertEqual(store.lastConfessionDate, fixedNow)
    }
}
```

- [ ] **Step 2: Implement `ExaminationStore` in `ExameConsciencia/Services/ExaminationStore.swift`**

Persist `active_draft.json` inside `storageDirectory` with `.completeFileProtection` on every mutation. Discard drafts where `nowProvider().timeIntervalSince(draft.updatedAt) > 86_400`. In `completeAbsolution()`, clear all sets/dictionaries/arrays, delete `active_draft.json`, and write `lastConfessionDate` to `userDefaults`.

- [ ] **Step 3: Verify project structure with `node scripts/validate-project.mjs`**

Run: `node scripts/validate-project.mjs`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add ExameConsciencia/Services/ExaminationStore.swift ExameConscienciaTests/ExaminationStoreTests.swift scripts/validate-project.mjs
git commit -m "feat: implement ExaminationStore with encrypted draft persistence and unit tests"
```

---

### Task 3: Liquid Glass ("Luz de Vela") Design System & Haptics

**Files:**
- Create: `ExameConsciencia/DesignSystem/LiquidGlassTheme.swift`

**Interfaces:**
- Consumes: SwiftUI, UIKit
- Produces:
  - `enum CandlelightPalette`:
    - `static let obsidian = Color(red: 0.027, green: 0.031, blue: 0.051)` (`#07080D`)
    - `static let warmAmber = Color(red: 0.961, green: 0.620, blue: 0.043)` (`#F59E0B`)
    - `static let sacredBronze = Color(red: 0.851, green: 0.467, blue: 0.024)` (`#D97706`)
    - `static let parchment = Color(red: 0.996, green: 0.953, blue: 0.780)` (`#FEF3C7`)
  - `struct CandlelightBackground: View`
  - `struct LiquidGlassCard<Content: View>: View` (`isHighlighted: Bool = false`, `@ViewBuilder content: () -> Content`)
  - `struct AmberPill: View` (`text: String`, `systemImage: String? = nil`, `isSelected: Bool = false`)
  - `enum Haptics`:
    - `static func selection()`
    - `static func impactLight()`
    - `static func absolutionSuccess()`

- [ ] **Step 1: Implement `ExameConsciencia/DesignSystem/LiquidGlassTheme.swift`**

Build `LiquidGlassCard` using `.ultraThinMaterial`, rounded rectangle (`cornerRadius: 22`, continuous style), top specular highlight linear gradient (`Color.white.opacity(0.35)` to `.clear`), border stroke (`isHighlighted ? CandlelightPalette.warmAmber.opacity(0.55) : Color.white.opacity(0.14)`), and subtle shadow.

- [ ] **Step 2: Run `node scripts/validate-project.mjs`**

Run: `node scripts/validate-project.mjs`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add ExameConsciencia/DesignSystem/LiquidGlassTheme.swift
git commit -m "feat: add Liquid Glass Luz de Vela design system and haptics"
```

---

### Task 4: Views, Navigation & Privacy Shield

**Files:**
- Create: `ExameConsciencia/Views/HomeView.swift`
- Create: `ExameConsciencia/Views/ExaminationView.swift`
- Create: `ExameConsciencia/Views/ConfessionalView.swift`
- Create: `ExameConsciencia/Views/PrivacyBlurView.swift`
- Create: `ExameConsciencia/App/ExameConscienciaApp.swift`

**Interfaces:**
- Consumes: `ExaminationStore` from Task 2, `CandlelightPalette`, `CandlelightBackground`, `LiquidGlassCard`, `AmberPill`, `Haptics` from Task 3
- Produces:
  - `struct HomeView: View`
  - `struct ExaminationView: View`
  - `struct ConfessionalView: View`
  - `struct PrivacyBlurView: View`
  - `@main struct ExameConscienciaApp: App`

- [ ] **Step 1: Implement `HomeView.swift`, `ExaminationView.swift`, `ConfessionalView.swift`, `PrivacyBlurView.swift`, and `ExameConscienciaApp.swift`**

- `HomeView`: Displays "Última Confissão" card with formatted pt-BR date + days elapsed (or "Ajustar data" `DatePicker` sheet), expandable "Oração ao Espírito Santo", "Iniciar Exame de Consciência" button, and quick link to "Modo Confessionário" when `store.totalSelectedCount > 0`.
- `ExaminationView`: Horizontal category selector pills, interactive question cards with checkmark + expandable optional note field, "Anotações Avulsas" card to add/remove custom sins, and floating bottom bar with `store.totalSelectedCount` and navigation to `ConfessionalView`.
- `ConfessionalView`: Displays liturgical greeting guide with days since last confession, list of marked questions (with notes) and custom entries (tappable to dim via `store.toggleConfessedItem`), sheet for "Ato de Contrição", and "Recebi a Absolvição" confirmation alert calling `store.completeAbsolution()`. Keeps screen awake (`UIApplication.shared.isIdleTimerDisabled = true`) while inside the confessional view.
- `ExameConscienciaApp`: Injects `ExaminationStore`, forces `.preferredColorScheme(.dark)`, and overlays `PrivacyBlurView` whenever `scenePhase != .active`.

- [ ] **Step 2: Run `node scripts/validate-project.mjs` to verify all Swift sources and symbols**

Run: `node scripts/validate-project.mjs`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add ExameConsciencia/Views ExameConsciencia/App scripts/validate-project.mjs
git commit -m "feat: implement HomeView, ExaminationView, ConfessionalView, and PrivacyBlurView"
```

---

### Task 5: GitHub Actions macOS Build & `.ipa` Packaging Pipeline

**Files:**
- Create: `.github/workflows/build-ios.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `project.yml`, `ExameConsciencia/**`, `ExameConscienciaTests/**`
- Produces:
  - `.github/workflows/build-ios.yml` workflow that generates `.xcodeproj` via `xcodegen`, runs `xcodebuild test` on iOS Simulator, builds generic iOS device archive (`CODE_SIGNING_ALLOWED=NO`), packages `Payload/ExameConsciencia.app` into `ExameConsciencia.ipa`, and uploads `ExameConsciencia.ipa` as a workflow artifact.

- [ ] **Step 1: Create `.github/workflows/build-ios.yml` and update `README.md` with installation instructions (AltStore / Sideloadly)**

- [ ] **Step 2: Run `node scripts/validate-project.mjs` locally**

Run: `node scripts/validate-project.mjs`
Expected: PASS

- [ ] **Step 3: Commit and push when approved**

```bash
git add .github/workflows/build-ios.yml README.md docs/superpowers/plans/2026-10-23-exame-consciencia-ios.md
git commit -m "ci: add GitHub Actions iOS build workflow and implementation plan"
```
