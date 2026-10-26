const fs = require('fs');
const path = require('path');
const cfg = require('./config.js');

console.log('--- Starting Verification Suite (تحدّي معرفة محمود — أسئلة عن مفضّلاتي) ---');

function testConfig() {
  console.log('Test 1: Testing Names and Mahmoud Favorites Quiz Config...');
  if (cfg.fianceeName !== 'شروق') throw new Error(`fianceeName should be شروق, got ${cfg.fianceeName}`);
  if (cfg.fianceName !== 'محمود') throw new Error(`fianceName should be محمود, got ${cfg.fianceName}`);

  if (!cfg.invitation.question.includes('كم تعرفينَ عن محمود')) throw new Error('Invitation question mismatch');
  if (!cfg.invitation.yesBtn.includes('جاهزة للتحدّي')) throw new Error('Yes button text mismatch');
  if (!cfg.invitation.noBtn.includes('لا')) throw new Error('No button text mismatch');

  // Verify Q1: Colors (الرمادي والأخضر)
  const correctColor = cfg.favoriteColors.find(c => c.isCorrect);
  if (!correctColor || !correctColor.name.includes('الرمادي والأخضر')) {
    throw new Error('Correct color must be الرمادي والأخضر');
  }

  // Verify Q2: Foods (الشاورما أو المسقعة أو الفت)
  const correctFood = cfg.favoriteFoods.find(f => f.isCorrect);
  if (!correctFood || !correctFood.name.includes('الشاورما أو المسقعة أو الفت')) {
    throw new Error('Correct food must be الشاورما أو المسقعة أو الفت');
  }

  // Verify Q3: Drinks (النسكافيه والشاي)
  const correctDrink = cfg.favoriteDrinks.find(d => d.isCorrect);
  if (!correctDrink || !correctDrink.name.includes('النسكافيه والشاي')) {
    throw new Error('Correct drink must be النسكافيه والشاي');
  }

  // Verify Q4: Outings (طلعات البحر والمطاعم)
  const correctOuting = cfg.favoriteOutings.find(o => o.isCorrect);
  if (!correctOuting || !correctOuting.name.includes('البحر والمطاعم')) {
    throw new Error('Correct outing must be طلعات البحر والمطاعم');
  }

  // Verify Q5: Interests (البرمجة وتطوير الويب)
  const correctInterest = cfg.favoriteInterests.find(i => i.isCorrect);
  if (!correctInterest || !correctInterest.name.includes('البرمجة وتطوير الويب')) {
    throw new Error('Correct interest must be البرمجة وتطوير الويب');
  }

  // Verify Q6 & Q7: Special Questions about Mahmoud
  if (!cfg.whatMakesMahmoudHappy || cfg.whatMakesMahmoudHappy.length < 4) {
    throw new Error('whatMakesMahmoudHappy must contain 4 options');
  }
  if (!cfg.specialTraitsInMahmoud || cfg.specialTraitsInMahmoud.length < 4) {
    throw new Error('specialTraitsInMahmoud must contain 4 options');
  }

  // Verify Q8: Quiz Prize & Note
  if (!cfg.giftConfig || !cfg.giftConfig.quickSuggestions || cfg.giftConfig.quickSuggestions.length < 4) {
    throw new Error('giftConfig must contain quickSuggestions');
  }

  console.log('✓ All 8 questions about Mahmoud (Grey/Green, Moussaka/Shawarma, Nescafe/Tea, Sea/Restaurants, Programming/Web) verified.');
}

function testHtml() {
  console.log('Test 2: Testing HTML markup...');
  const html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8');

  if (!html.includes('lang="ar"')) throw new Error('HTML must specify lang="ar"');
  if (!html.includes('dir="rtl"')) throw new Error('HTML must specify dir="rtl"');
  ['step-0', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8', 'step-summary'].forEach(id => {
    if (!html.includes(`id="${id}"`)) throw new Error(`HTML missing section ${id}`);
  });
  ['summaryColorVal', 'summaryFoodVal', 'summaryDrinkVal', 'summaryOutingVal', 'summaryInterestVal', 'summaryHappyVal', 'summaryTraitVal', 'summaryGiftVal'].forEach(id => {
    if (!html.includes(`id="${id}"`)) throw new Error(`HTML missing summary element ${id}`);
  });

  console.log('✓ HTML pure 8-step Quiz markup verified.');
}

function testCss() {
  console.log('Test 3: Testing CSS styles...');
  const css = fs.readFileSync(path.join(__dirname, './style.css'), 'utf-8');

  if (!css.includes('direction: rtl')) throw new Error('CSS must set RTL direction');
  if (!css.includes('btn-quiz-hint')) throw new Error('CSS must style btn-quiz-hint');
  if (!css.includes('trophy-badge-banner')) throw new Error('CSS must style trophy-badge-banner');

  console.log('✓ CSS styles verified.');
}

try {
  testConfig();
  testHtml();
  testCss();
  console.log('\n🌟 ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY! 🌟');
} catch (err) {
  console.error('\n❌ Verification Failed:', err.message);
  process.exit(1);
}
