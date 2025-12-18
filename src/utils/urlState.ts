import type { FilterState, ProductTag, SortOption } from '../types/product';
import { DEFAULT_FILTERS } from './presets';

export function encodeFiltersToURL(filters: FilterState): string {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
  if (filters.caloriesRange[0] !== DEFAULT_FILTERS.caloriesRange[0] || filters.caloriesRange[1] !== DEFAULT_FILTERS.caloriesRange[1]) {
    params.set('calories', `${filters.caloriesRange[0]}-${filters.caloriesRange[1]}`);
  }
  if (filters.proteinRange[0] !== DEFAULT_FILTERS.proteinRange[0] || filters.proteinRange[1] !== DEFAULT_FILTERS.proteinRange[1]) {
    params.set('protein', `${filters.proteinRange[0]}-${filters.proteinRange[1]}`);
  }
  if (filters.fatRange[0] !== DEFAULT_FILTERS.fatRange[0] || filters.fatRange[1] !== DEFAULT_FILTERS.fatRange[1]) {
    params.set('fat', `${filters.fatRange[0]}-${filters.fatRange[1]}`);
  }
  if (filters.carbsRange[0] !== DEFAULT_FILTERS.carbsRange[0] || filters.carbsRange[1] !== DEFAULT_FILTERS.carbsRange[1]) {
    params.set('carbs', `${filters.carbsRange[0]}-${filters.carbsRange[1]}`);
  }
  if (filters.proteinPerCalorieMin > 0) params.set('ppc', filters.proteinPerCalorieMin.toString());
  if (filters.isLowCarb) params.set('lowCarb', '1');
  if (filters.isHighProtein) params.set('highProtein', '1');
  if (filters.labTestedOnly) params.set('labTested', '1');
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder !== DEFAULT_FILTERS.sortOrder) params.set('sortOrder', filters.sortOrder);

  return params.toString();
}

export function decodeFiltersFromURL(urlParams: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const search = urlParams.get('search');
  if (search) filters.search = search;

  const tags = urlParams.get('tags');
  if (tags) {
    filters.tags = tags.split(',').filter(tag =>
      ['Мясо', 'Сласть', 'Творог', 'Колбаса'].includes(tag)
    ) as ProductTag[];
  }

  const calories = urlParams.get('calories');
  if (calories) {
    const [min, max] = calories.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.caloriesRange = [min, max];
  }

  const protein = urlParams.get('protein');
  if (protein) {
    const [min, max] = protein.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.proteinRange = [min, max];
  }

  const fat = urlParams.get('fat');
  if (fat) {
    const [min, max] = fat.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.fatRange = [min, max];
  }

  const carbs = urlParams.get('carbs');
  if (carbs) {
    const [min, max] = carbs.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) filters.carbsRange = [min, max];
  }

  const ppc = urlParams.get('ppc');
  if (ppc) {
    const value = Number(ppc);
    if (!isNaN(value)) filters.proteinPerCalorieMin = value;
  }

  if (urlParams.get('lowCarb') === '1') filters.isLowCarb = true;
  if (urlParams.get('highProtein') === '1') filters.isHighProtein = true;
  if (urlParams.get('labTested') === '1') filters.labTestedOnly = true;

  const sortBy = urlParams.get('sortBy');
  if (sortBy) filters.sortBy = sortBy as SortOption;

  const sortOrder = urlParams.get('sortOrder');
  if (sortOrder === 'asc' || sortOrder === 'desc') filters.sortOrder = sortOrder;

  return filters;
}
