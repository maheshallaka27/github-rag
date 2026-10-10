export function shouldEscalate(answer, results) {
  if (!answer || answer.trim().length === 0) {
    return true;
  }

  if (!results || results.length === 0) {
    return true;
  }

  const bestDistance = results[0]?.distance ?? Infinity;

  // Very weak retrieval
  if (bestDistance > 1.2) {
    return true;
  }

  const weakPhrases = [
    "i could not find enough",
    "i don't have enough information",
    "i cannot determine",
    "not enough information",
    "i'm not sure",
  ];

  const lowerAnswer = answer.toLowerCase();

  for (const phrase of weakPhrases) {
    if (lowerAnswer.includes(phrase)) {
      return true;
    }
  }

  return false;
}
