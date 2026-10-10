export function classifyQuery(query) {
  const q = query.toLowerCase();

  const complexKeywords = [
    "debug",
    "bug",
    "error",
    "fix",
    "architecture",
    "refactor",
    "optimize",
    "performance",
    "why does",
    "why is",
    "impact",
    "dependency",
    "security",
    "design",
  ];

  for (const keyword of complexKeywords) {
    if (q.includes(keyword)) {
      return "complex";
    }
  }

  return "simple";
}

export function chooseModel(query, results) {
  const queryType = classifyQuery(query);
  const bestDistance = results.length > 0 ? results[0].distance : Infinity;

  if (queryType === "complex") {
    return "cloud";
  }

  // No good retrieval result
  if (bestDistance > 1.2) {
    return "cloud";
  }

  return "local";
}
