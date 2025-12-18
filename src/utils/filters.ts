import type { Product, FilterState, SortOption } from '../types/product';

export function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter(product => {
    // Поиск по названию
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    // Фильтр по категориям
    if (filters.tags.length > 0 && !filters.tags.includes(product.tag)) {
      return false;
    }
    
    // Диапазон калорий
    if (product.calories < filters.caloriesRange[0] || product.calories > filters.caloriesRange[1]) {
      return false;
    }
    
    // Диапазон белка
    if (product.protein < filters.proteinRange[0] || product.protein > filters.proteinRange[1]) {
      return false;
    }
    
    // Диапазон жиров
    if (product.fat < filters.fatRange[0] || product.fat > filters.fatRange[1]) {
      return false;
    }
    
    // Диапазон углеводов
    if (product.carbs < filters.carbsRange[0] || product.carbs > filters.carbsRange[1]) {
      return false;
    }
    
    // Минимум белка на 100 ккал
    if (filters.proteinPerCalorieMin > 0 && product.proteinPerCalorie < filters.proteinPerCalorieMin) {
      return false;
    }
    
    // Low-carb режим
    if (filters.isLowCarb && !product.isLowCarb) {
      return false;
    }
    
    // High-protein режим
    if (filters.isHighProtein && !product.isHighProtein) {
      return false;
    }
    
    // Только проверенные в лаборатории
    if (filters.labTestedOnly && !product.labTested) {
      return false;
    }
    
    return true;
  });
}

export function sortProducts(products: Product[], sortBy: SortOption, sortOrder: 'asc' | 'desc'): Product[] {
  const sorted = [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'calories':
        comparison = a.calories - b.calories;
        break;
      case 'protein':
        comparison = a.protein - b.protein;
        break;
      case 'proteinPerCalorie':
        comparison = a.proteinPerCalorie - b.proteinPerCalorie;
        break;
      case 'carbs':
        comparison = a.carbs - b.carbs;
        break;
      case 'fat':
        comparison = a.fat - b.fat;
        break;
      case 'price':
        // null цены в конец
        if (a.price === null && b.price === null) comparison = 0;
        else if (a.price === null) comparison = 1;
        else if (b.price === null) comparison = -1;
        else comparison = a.price - b.price;
        break;
      case 'taste':
        comparison = a.taste - b.taste;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name, 'ru');
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}

export function getFilteredAndSortedProducts(products: Product[], filters: FilterState): Product[] {
  const filtered = filterProducts(products, filters);
  return sortProducts(filtered, filters.sortBy, filters.sortOrder);
}
