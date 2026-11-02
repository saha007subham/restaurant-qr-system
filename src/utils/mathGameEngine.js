/**
 * Mental Math Game Engine
 * Generates rapid-fire addition, subtraction, and multiplication challenges
 * with 4 multiple-choice options.
 */

export const generateMathProblem = (streak = 0) => {
  const operations = ['+', '-', '×'];
  // Weight operations slightly depending on streak
  const op = operations[Math.floor(Math.random() * operations.length)];
  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  if (op === '+') {
    if (streak < 5) {
      num1 = Math.floor(Math.random() * 20) + 5;
      num2 = Math.floor(Math.random() * 20) + 5;
    } else {
      num1 = Math.floor(Math.random() * 50) + 12;
      num2 = Math.floor(Math.random() * 50) + 12;
    }
    answer = num1 + num2;
  } else if (op === '-') {
    if (streak < 5) {
      num1 = Math.floor(Math.random() * 30) + 10;
      num2 = Math.floor(Math.random() * (num1 - 2)) + 2;
    } else {
      num1 = Math.floor(Math.random() * 70) + 20;
      num2 = Math.floor(Math.random() * (num1 - 5)) + 5;
    }
    answer = num1 - num2;
  } else {
    // Multiplication
    if (streak < 4) {
      num1 = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
    } else {
      num1 = Math.floor(Math.random() * 11) + 3;
      num2 = Math.floor(Math.random() * 12) + 3;
    }
    answer = num1 * num2;
  }

  // Generate 3 clever distractors
  const distractors = new Set();
  const offsets = [-2, 2, -1, 1, -10, 10, -5, 5, 3, -3];

  // Shuffle offsets
  const shuffledOffsets = [...offsets].sort(() => Math.random() - 0.5);

  for (const offset of shuffledOffsets) {
    const candidate = answer + offset;
    if (candidate > 0 && candidate !== answer) {
      distractors.add(candidate);
    }
    if (distractors.size === 3) break;
  }

  // Fallback in case set is smaller than 3
  let fallbackDelta = 4;
  while (distractors.size < 3) {
    const candidate = answer + fallbackDelta;
    if (candidate > 0 && candidate !== answer) {
      distractors.add(candidate);
    }
    fallbackDelta += 2;
  }

  // Combine answer and distractors into 4 shuffled options
  const options = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

  return {
    num1,
    num2,
    operator: op,
    answer,
    options
  };
};

export const getPersonalBest = () => {
  try {
    const stored = localStorage.getItem('cafe_math_high_score');
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

export const savePersonalBest = (score) => {
  try {
    const currentBest = getPersonalBest();
    if (score > currentBest) {
      localStorage.setItem('cafe_math_high_score', score.toString());
      return true; // New record
    }
    return false;
  } catch {
    return false;
  }
};

