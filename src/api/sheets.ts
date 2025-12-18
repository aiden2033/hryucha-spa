import Papa from 'papaparse';
import type { Product, RawProduct, ProductTag } from '../types/product';

// ID твоей Google Sheets таблицы
const SHEET_ID = '1-9ZBfjg4LhWyH83BEv8EM95D8FrpnzUR0v9fsTtmHK0';
const GID = '0';

// URL для получения CSV из публичной таблицы
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

// Маппинг заголовков из таблицы на наши поля
const HEADER_MAP: Record<string, keyof RawProduct> = {
  'Название': 'name',
  'name': 'name',
  'Цена': 'price',
  'Ср. цена': 'price',
  'price': 'price',
  'Вкус': 'taste',
  'taste': 'taste',
  'Схожесть': 'similarity',
  'Схожесть с ориг, %': 'similarity',
  'similarity': 'similarity',
  'Калории': 'calories',
  'Ккал на 100гр.': 'calories',
  'calories': 'calories',
  'Ккал': 'calories',
  'Белок': 'protein',
  'Белок на 100гр': 'protein',
  'protein': 'protein',
  'Б': 'protein',
  'Жиры': 'fat',
  'Жиры на 100г': 'fat',
  'fat': 'fat',
  'Ж': 'fat',
  'Углеводы': 'carbs',
  'Углеводы на 100г': 'carbs',
  'carbs': 'carbs',
  'У': 'carbs',
  'КБЖУ': 'totalMacros',
  'Общий кбжу': 'totalMacros',
  'totalMacros': 'totalMacros',
  'Проверено': 'labTested',
  'Проверено в лаборатории': 'labTested',
  'labTested': 'labTested',
  'Ссылки': 'links',
  'links': 'links',
  'Категория': 'tag',
  'tag': 'tag',
  'Тэг': 'tag',
};

function parseNumber(value: string | undefined | null): number {
  if (!value) return 0;
  const cleaned = value.toString().replace(',', '.').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseNullableNumber(value: string | undefined | null): number | null {
  if (!value || value.trim() === '' || value === '-') return null;
  const num = parseNumber(value);
  return num === 0 && !value.includes('0') ? null : num;
}

function parseBoolean(value: string | undefined | null): boolean {
  if (!value) return false;
  const lower = value.toString().toLowerCase().trim();
  return lower === 'да' || lower === 'true' || lower === '1' || lower === 'yes' || lower === '✓';
}

function parseLinks(value: string | undefined | null): string[] {
  if (!value) return [];
  // Разделяем по запятой, пробелу или переносу строки
  return value
    .split(/[,\s\n]+/)
    .map(link => link.trim())
    .filter(link => link.startsWith('http'));
}

function parseTag(value: string | undefined | null): ProductTag {
  if (!value) return 'Другое';
  const tag = value.trim();
  if (['Мясо', 'Сласть', 'Творог', 'Колбаса'].includes(tag)) {
    return tag as ProductTag;
  }
  return 'Другое';
}

function calculateDerivedFields(product: Omit<Product, 'proteinPerCalorie' | 'proteinRatio' | 'carbsRatio' | 'fatRatio' | 'isLowCarb' | 'isHighProtein'>): Product {
  const { calories, protein, fat, carbs } = product;
  
  // Защита от деления на ноль
  const safeCalories = calories || 1;
  
  // Грамм белка на 100 ккал
  const proteinPerCalorie = (protein / safeCalories) * 100;
  
  // Процент калорий из каждого макронутриента
  // Белок: 4 ккал/г, Жиры: 9 ккал/г, Углеводы: 4 ккал/г
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbsCalories = carbs * 4;
  const totalMacroCalories = proteinCalories + fatCalories + carbsCalories || 1;
  
  const proteinRatio = (proteinCalories / totalMacroCalories) * 100;
  const fatRatio = (fatCalories / totalMacroCalories) * 100;
  const carbsRatio = (carbsCalories / totalMacroCalories) * 100;
  
  return {
    ...product,
    proteinPerCalorie: Math.round(proteinPerCalorie * 10) / 10,
    proteinRatio: Math.round(proteinRatio),
    fatRatio: Math.round(fatRatio),
    carbsRatio: Math.round(carbsRatio),
    isLowCarb: carbs < 10,
    isHighProtein: protein > 20,
  };
}

function transformRow(row: Record<string, string>, index: number): Product | null {
  // Маппим заголовки
  const mapped: Partial<RawProduct> = {};
  for (const [key, value] of Object.entries(row)) {
    const mappedKey = HEADER_MAP[key] || HEADER_MAP[key.trim()];
    if (mappedKey) {
      mapped[mappedKey] = value;
    }
  }
  
  // Проверяем обязательные поля
  if (!mapped.name || !mapped.calories) {
    return null;
  }
  
  const baseProduct = {
    id: `product-${index}`,
    name: mapped.name.trim(),
    price: parseNullableNumber(mapped.price),
    taste: parseNumber(mapped.taste) || 5,
    similarity: parseNullableNumber(mapped.similarity),
    calories: parseNumber(mapped.calories),
    protein: parseNumber(mapped.protein),
    fat: parseNumber(mapped.fat),
    carbs: parseNumber(mapped.carbs),
    totalMacros: mapped.totalMacros || '',
    labTested: parseBoolean(mapped.labTested),
    links: parseLinks(mapped.links),
    tag: parseTag(mapped.tag),
  };
  
  return calculateDerivedFields(baseProduct);
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('Начинаем загрузку данных из Google Sheets...', CSV_URL);
    const response = await fetch(CSV_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    console.log('CSV загружен, размер:', csvText.length, 'символов');

    return new Promise((resolve, reject) => {
      Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('CSV распарсен, строк:', results.data.length);
          console.log('Первая строка заголовков:', Object.keys(results.data[0] || {}));

          const products = results.data
            .map((row, index) => transformRow(row, index))
            .filter((p): p is Product => p !== null);

          console.log(`Загружено ${products.length} продуктов из Google Sheets`);
          if (products.length > 0) {
            console.log('Первый продукт:', products[0]);
          }
          resolve(products);
        },
        error: (error: Error) => {
          console.error('Ошибка парсинга CSV:', error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    throw error;
  }
}
