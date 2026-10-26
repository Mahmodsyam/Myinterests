const cfg = require('./config.js');

console.log('--- Running Deep Logic & Score Simulation (تحدّي معرفة محمود) ---');

let state = {
  color: cfg.favoriteColors[0],      // الرمادي والأخضر (isCorrect: true)
  food: cfg.favoriteFoods[0],        // المسقعة والشاورما (isCorrect: true)
  drink: cfg.favoriteDrinks[0],      // النسكافيه والشاي (isCorrect: true)
  outing: cfg.favoriteOutings[0],    // طلعات البحر والمطاعم (isCorrect: true)
  interest: cfg.favoriteInterests[0],// البرمجة وتطوير الويب (isCorrect: true)
  happy: cfg.whatMakesMahmoudHappy[0],
  trait: cfg.specialTraitsInMahmoud[0],
  gift: 'عزومة شاورما أو مطعم زاكية سوا 🌯🍽️',
  note: 'حافظتك صمّ يا أحلى باشمهندس بالدنيا 💛'
};

function calculateQuizScore(s) {
  const factualAnswers = [s.color, s.food, s.drink, s.outing, s.interest];
  let correctCount = 0;
  factualAnswers.forEach(ans => {
    if (ans && ans.isCorrect) correctCount++;
  });
  return {
    score: correctCount,
    total: 5,
    percent: Math.round((correctCount / 5) * 100)
  };
}

const scoreRes = calculateQuizScore(state);
if (scoreRes.score !== 5 || scoreRes.percent !== 100) {
  throw new Error(`Expected 5/5 (100%), got ${scoreRes.score}/${scoreRes.total}`);
}
console.log(`✓ Perfect score calculation verified: ${scoreRes.score}/${scoreRes.total} (${scoreRes.percent}%)`);

// Test partial score when 1 answer is wrong
const partialState = Object.assign({}, state, { drink: cfg.favoriteDrinks[1] });
const partialRes = calculateQuizScore(partialState);
if (partialRes.score !== 4 || partialRes.percent !== 80) {
  throw new Error(`Expected 4/5 (80%), got ${partialRes.score}/${partialRes.total}`);
}
console.log(`✓ Partial score calculation verified: ${partialRes.score}/${partialRes.total} (${partialRes.percent}%)`);

console.log('\n🌟 ALL SIMULATION TESTS PASSED! 🌟');
