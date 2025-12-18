export interface RawProduct {
  name: string;
  price: string;
  taste: string;
  similarity: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  totalMacros: string;
  labTested: string;
  links: string;
  tag: string;
}

export interface Product {
  id: string;
  name: string;
  price: number | null;
  taste: number;
  similarity: number | null;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  totalMacros: string;
  labTested: boolean;
  links: string[];
  tag: ProductTag;
  // Вычисляемые поля
  proteinPerCalorie: number;
  proteinRatio: number;
  carbsRatio: number;
  fatRatio: number;
  isLowCarb: boolean;
  isHighProtein: boolean;
}

export type ProductTag = 'Мясо' | 'Сласть' | 'Творог' | 'Колбаса' | 'Другое';

export interface FilterState {
  // Базовые фильтры
  search: string;
  tags: ProductTag[];
  caloriesRange: [number, number];
  proteinRange: [number, number];
  fatRange: [number, number];
  carbsRange: [number, number];
  // Продвинутые фильтры
  proteinPerCalorieMin: number;
  isLowCarb: boolean;
  isHighProtein: boolean;
  labTestedOnly: boolean;
  // Сортировка
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 
  | 'calories'
  | 'protein'
  | 'proteinPerCalorie'
  | 'price'
  | 'taste'
  | 'name'
  | 'carbs'
  | 'fat';

export type PresetKey = 
  | 'bulking'
  | 'cutting'
  | 'keto'
  | 'sweets'
  | 'highProtein'
  | 'labTested';

export interface Preset {
  key: PresetKey;
  name: string;
  emoji: string;
  description: string;
  filters: Partial<FilterState>;
}
