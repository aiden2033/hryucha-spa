import { useState, useCallback, useMemo, useEffect } from 'react';
import type { FilterState, PresetKey, Product } from '../types/product';
import { DEFAULT_FILTERS, PRESETS, applyPreset } from '../utils/presets';
import { getFilteredAndSortedProducts } from '../utils/filters';
import { encodeFiltersToURL, decodeFiltersFromURL } from '../utils/urlState';
import { useDebounce } from './useLocalStorage';

export function useFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window === 'undefined') return DEFAULT_FILTERS;

    const urlParams = new URLSearchParams(window.location.search);
    const urlFilters = decodeFiltersFromURL(urlParams);

    if (Object.keys(urlFilters).length > 0) {
      return { ...DEFAULT_FILTERS, ...urlFilters };
    }

    try {
      const saved = localStorage.getItem('hryucha-filters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_FILTERS, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading filters from localStorage:', error);
    }

    return DEFAULT_FILTERS;
  });

  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  const filtersWithDebouncedSearch = useMemo(() => ({
    ...filters,
    search: debouncedSearch
  }), [filters, debouncedSearch]);

  useEffect(() => {
    const urlString = encodeFiltersToURL(filtersWithDebouncedSearch);
    const newUrl = urlString ? `${window.location.pathname}?${urlString}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);

    try {
      localStorage.setItem('hryucha-filters', JSON.stringify(filtersWithDebouncedSearch));
    } catch (error) {
      console.warn('Error saving filters to localStorage:', error);
    }
  }, [filtersWithDebouncedSearch]);

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    if (key === 'search') {
      setSearchInput(value as string);
      setFilters(prev => ({ ...prev, search: value as string }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    setActivePreset(null);
  }, []);

  const selectPreset = useCallback((presetKey: PresetKey | null) => {
    if (presetKey === null) {
      setFilters(DEFAULT_FILTERS);
      setSearchInput('');
      setActivePreset(null);
    } else {
      const preset = PRESETS.find(p => p.key === presetKey);
      if (preset) {
        const newFilters = applyPreset(filters, preset);
        setFilters(newFilters);
        setSearchInput(newFilters.search);
        setActivePreset(presetKey);
      }
    }
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
    setActivePreset(null);
  }, []);

  const filteredProducts = useMemo(() => {
    return getFilteredAndSortedProducts(products, filtersWithDebouncedSearch);
  }, [products, filtersWithDebouncedSearch]);

  const stats = useMemo(() => {
    if (filteredProducts.length === 0) {
      return {
        total: products.length,
        filtered: 0,
        avgCalories: 0,
        avgProtein: 0,
        avgFat: 0,
        avgCarbs: 0,
        avgProteinPerCalorie: 0,
      };
    }

    const sum = filteredProducts.reduce(
      (acc, p) => ({
        calories: acc.calories + p.calories,
        protein: acc.protein + p.protein,
        fat: acc.fat + p.fat,
        carbs: acc.carbs + p.carbs,
        proteinPerCalorie: acc.proteinPerCalorie + p.proteinPerCalorie,
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0, proteinPerCalorie: 0 }
    );

    const count = filteredProducts.length;

    return {
      total: products.length,
      filtered: count,
      avgCalories: Math.round(sum.calories / count),
      avgProtein: Math.round((sum.protein / count) * 10) / 10,
      avgFat: Math.round((sum.fat / count) * 10) / 10,
      avgCarbs: Math.round((sum.carbs / count) * 10) / 10,
      avgProteinPerCalorie: Math.round((sum.proteinPerCalorie / count) * 10) / 10,
    };
  }, [products.length, filteredProducts]);

  return {
    filters,
    activePreset,
    searchInput,
    updateFilter,
    selectPreset,
    resetFilters,
    filteredProducts,
    stats,
  };
}
