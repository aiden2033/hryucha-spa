import type { FilterState } from '../types/product';
import { DEFAULT_FILTERS } from './presets';

export function countActiveFilters(filters: FilterState): number {
  let count = 0;

  if (filters.search) count++;
  if (filters.tags.length > 0) count++;

  if (filters.caloriesRange[0] !== DEFAULT_FILTERS.caloriesRange[0] ||
      filters.caloriesRange[1] !== DEFAULT_FILTERS.caloriesRange[1]) count++;

  if (filters.proteinRange[0] !== DEFAULT_FILTERS.proteinRange[0] ||
      filters.proteinRange[1] !== DEFAULT_FILTERS.proteinRange[1]) count++;

  if (filters.fatRange[0] !== DEFAULT_FILTERS.fatRange[0] ||
      filters.fatRange[1] !== DEFAULT_FILTERS.fatRange[1]) count++;

  if (filters.carbsRange[0] !== DEFAULT_FILTERS.carbsRange[0] ||
      filters.carbsRange[1] !== DEFAULT_FILTERS.carbsRange[1]) count++;

  if (filters.proteinPerCalorieMin > 0) count++;
  if (filters.isLowCarb) count++;
  if (filters.isHighProtein) count++;
  if (filters.labTestedOnly) count++;

  return count;
}

export function hasActiveFilters(filters: FilterState): boolean {
  return countActiveFilters(filters) > 0;
}
