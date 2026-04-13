function getBudgetScore(price, budget) {
  if (budget === 'all') {
    return 15;
  }

  if (budget === 'budget') {
    return price < 50000 ? 25 : price <= 100000 ? 10 : 0;
  }

  if (budget === 'mid') {
    return price >= 50000 && price <= 100000 ? 25 : price < 50000 ? 14 : 8;
  }

  if (budget === 'premium') {
    return price > 100000 ? 25 : price >= 50000 ? 12 : 4;
  }

  return 0;
}

function clampRating(rating) {
  if (typeof rating !== 'number' || Number.isNaN(rating)) {
    return 0;
  }
  return Math.max(0, Math.min(10, rating));
}

export function getRecommendationScore(destination, preference = {}) {
  const category = preference.category || 'All';
  const budget = preference.budget || 'all';
  const preferredTags = preference.preferredTags || [];

  const categoryScore =
    category === 'All'
      ? 15
      : Array.isArray(destination.category) && destination.category.includes(category)
        ? 35
        : 0;

  const safeRating = clampRating(destination.rating);
  const ratingScore = safeRating * 5;

  const budgetScore = getBudgetScore(destination.price, budget);

  const tagScore = preferredTags.reduce((score, tag) => {
    return destination.tags.includes(tag) ? score + 8 : score;
  }, 0);

  return categoryScore + ratingScore + budgetScore + tagScore;
}

export function getTopRecommendations(destinations, preference, limit = 6) {
  return [...destinations]
    .map((destination) => ({
      ...destination,
      rating: clampRating(destination.rating),
      score: getRecommendationScore(destination, preference),
    }))
    .sort((first, second) => {
      if (second.score === first.score) {
        return second.rating - first.rating;
      }

      return second.score - first.score;
    })
    .slice(0, limit);
}
