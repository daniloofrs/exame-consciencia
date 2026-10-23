import fs from 'fs';

const catalogPath = 'ExameConsciencia/Resources/examination_catalog.json';
const modelsPath = 'ExameConsciencia/Models/ExaminationModels.swift';
const storePath = 'ExameConsciencia/Services/ExaminationStore.swift';
const storeTestsPath = 'ExameConscienciaTests/ExaminationStoreTests.swift';
const themePath = 'ExameConsciencia/DesignSystem/LiquidGlassTheme.swift';
const homeViewPath = 'ExameConsciencia/Views/HomeView.swift';
const examViewPath = 'ExameConsciencia/Views/ExaminationView.swift';
const confessionalViewPath = 'ExameConsciencia/Views/ConfessionalView.swift';
const privacyViewPath = 'ExameConsciencia/Views/PrivacyBlurView.swift';
const appEntryPath = 'ExameConsciencia/App/ExameConscienciaApp.swift';
const workflowPath = '.github/workflows/build-ios.yml';
const projectYmlPath = 'project.yml';

for (const p of [
  projectYmlPath,
  modelsPath,
  catalogPath,
  storePath,
  storeTestsPath,
  themePath,
  homeViewPath,
  examViewPath,
  confessionalViewPath,
  privacyViewPath,
  appEntryPath,
  workflowPath
]) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing ${p}`);
  }
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
if (!Array.isArray(catalog.prayers) || catalog.prayers.length < 2) {
  throw new Error('Missing prayers in catalog');
}
if (!Array.isArray(catalog.categories) || catalog.categories.length < 13) {
  throw new Error('Expected at least 13 categories (10 commandments + precepts + capital sins + state duties)');
}

const seenQuestionIds = new Set();
let totalQuestions = 0;
for (const cat of catalog.categories) {
  if (!cat.id || !cat.title || !cat.subtitle || !cat.symbolName || !Array.isArray(cat.questions) || cat.questions.length === 0) {
    throw new Error(`Invalid category structure: ${JSON.stringify(cat)}`);
  }
  for (const q of cat.questions) {
    if (!q.id || !q.commandmentLabel || !q.text) {
      throw new Error(`Invalid question in ${cat.id}: ${JSON.stringify(q)}`);
    }
    if (seenQuestionIds.has(q.id)) {
      throw new Error(`Duplicate question ID: ${q.id}`);
    }
    seenQuestionIds.add(q.id);
    totalQuestions++;
  }
}

console.log(`Catalog validation passed: ${catalog.categories.length} categories, ${totalQuestions} questions, ${catalog.prayers.length} prayers`);

// Verify XcodeGen scheme includes ExameConscienciaTests
const projectYml = fs.readFileSync(projectYmlPath, 'utf8');
if (!projectYml.includes('testTargets:') || !projectYml.includes('- ExameConscienciaTests')) {
  throw new Error('project.yml must configure scheme.testTargets with ExameConscienciaTests');
}

// Verify Swift 6 concurrency safety in HomeView (no static DateFormatter) and NavigationPath pop-to-root
const homeSwift = fs.readFileSync(homeViewPath, 'utf8');
if (homeSwift.includes('static let dateFormatter')) {
  throw new Error('HomeView must not use non-Sendable static DateFormatter in Swift 6');
}
if (!homeSwift.includes('NavigationPath')) {
  throw new Error('HomeView must use NavigationPath to return to root after absolution');
}

// Verify QuestionCardView resets draftNote on isSelected change
const examSwift = fs.readFileSync(examViewPath, 'utf8');
if (!examSwift.includes('.onChange(of: isSelected)')) {
  throw new Error('ExaminationView QuestionCardView must reset draftNote on .onChange(of: isSelected)');
}

