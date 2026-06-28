import type { Destination, ScoredDestination, ScoringPreference } from '@/types';

function getBudgetScore(price: number, budget: string): number {
  if (budget === 'all') return 15;
  if (budget === 'budget') return price < 50000 ? 25 : price <= 100000 ? 10 : 0;
  if (budget === 'mid') return price >= 50000 && price <= 100000 ? 25 : price < 50000 ? 14 : 8;
  if (budget === 'premium') return price > 100000 ? 25 : price >= 50000 ? 12 : 4;
  return 0;
}

function clampRating(rating: number): number {
  if (typeof rating !== 'number' || Number.isNaN(rating)) return 0;
  return Math.max(0, Math.min(10, rating));
}

export function getRecommendationScore(
  destination: Destination,
  preference: Partial<ScoringPreference> = {}
): number {
  const category = preference.category || 'All';
  const budget = preference.budget || 'all';
  const preferredTags = preference.preferredTags || [];

  const categoryScore =
    category === 'All'
      ? 15
      : destination.category.includes(category)
        ? 35
        : 0;

  const safeRating = clampRating(destination.rating);
  const ratingScore = safeRating * 5;
  const budgetScore = getBudgetScore(destination.price, budget);

  const tagScore = preferredTags.reduce(
    (score, tag) => (destination.tags.includes(tag) ? score + 8 : score),
    0
  );

  return categoryScore + ratingScore + budgetScore + tagScore;
}

export function getTopRecommendations(
  destinations: Destination[],
  preference: Partial<ScoringPreference>,
  limit = 6
): ScoredDestination[] {
  return [...destinations]
    .map((dest) => ({
      ...dest,
      rating: clampRating(dest.rating),
      score: getRecommendationScore(dest, preference),
    }))
    .sort((a, b) => (b.score === a.score ? b.rating - a.rating : b.score - a.score))
    .slice(0, limit);
}
