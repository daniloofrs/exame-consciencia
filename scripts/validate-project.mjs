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
