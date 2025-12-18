import type { Preset, FilterState } from '../types/product';

export const PRESETS: Preset[] = [
  {
    key: 'bulking',
    name: 'Набор массы',
    emoji: '🏋️',
    description: 'Максимум белка на калорию',
    filters: {
      proteinRange: [15, 100],
      proteinPerCalorieMin: 10,
      sortBy: 'proteinPerCalorie',
      sortOrder: 'desc',
    },
  },
  {
    key: 'cutting',
    name: 'Сушка',
    emoji: '🔥',
    description: 'Минимум калорий и жиров',
    filters: {
      caloriesRange: [0, 100],
      fatRange: [0, 5],
      sortBy: 'calories',
      sortOrder: 'asc',
    },
  },
  {
    key: 'keto',
    name: 'Кето',
    emoji: '🥑',
    description: 'Минимум углеводов',
    filters: {
      carbsRange: [0, 5],
      fatRange: [5, 100],
      isLowCarb: true,
      sortBy: 'carbs',
      sortOrder: 'asc',
    },
  },
  {
    key: 'sweets',
    name: 'Сласти',
    emoji: '🍬',
    description: 'Сладкое без вреда',
    filters: {
      tags: ['Сласть'],
      caloriesRange: [0, 150],
      sortBy: 'taste',
      sortOrder: 'desc',
    },
  },
  {
    key: 'highProtein',
    name: 'Протеиновые',
    emoji: '💪',
    description: 'Максимум белка',
    filters: {
      proteinRange: [25, 100],
      isHighProtein: true,
      sortBy: 'protein',
      sortOrder: 'desc',
    },
  },
  {
    key: 'labTested',
    name: 'Проверенные',
    emoji: '✅',
    description: 'С лабораторными анализами',
    filters: {
      labTestedOnly: true,
    },
  },
];

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  tags: [],
  caloriesRange: [0, 500],
  proteinRange: [0, 100],
  fatRange: [0, 100],
  carbsRange: [0, 100],
  proteinPerCalorieMin: 0,
  isLowCarb: false,
  isHighProtein: false,
  labTestedOnly: false,
  sortBy: 'protein',
  sortOrder: 'desc',
};

export function applyPreset(_currentFilters: FilterState, preset: Preset): FilterState {
  return {
    ...DEFAULT_FILTERS,
    ...preset.filters,
  };
}
