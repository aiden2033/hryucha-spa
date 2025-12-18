import { useState } from 'react';
import { Search, X, RotateCcw, ChevronDown, Share2, Check } from 'lucide-react';
import type { FilterState, ProductTag, SortOption, PresetKey } from '../types/product';
import { PRESETS } from '../utils/presets';

interface FilterPanelProps {
  filters: FilterState;
  searchInput: string;
  activePreset: PresetKey | null;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onSelectPreset: (preset: PresetKey | null) => void;
  onReset: () => void;
  stats: {
    total: number;
    filtered: number;
    avgCalories: number;
    avgProtein: number;
    avgFat: number;
    avgCarbs: number;
    avgProteinPerCalorie: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const ALL_TAGS: ProductTag[] = ['Мясо', 'Сласть', 'Творог', 'Колбаса'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'protein', label: 'По белку' },
  { value: 'calories', label: 'По калориям' },
  { value: 'proteinPerCalorie', label: 'По Б/100ккал' },
  { value: 'price', label: 'По цене' },
  { value: 'taste', label: 'По вкусу' },
  { value: 'name', label: 'По названию' },
];

function RangeSlider({
  label,
  value,
  min,
  max,
  onChange,
  unit = '',
}: {
  label: string;
  value: [number, number];
  min: number;
  max: number;
  onChange: (value: [number, number]) => void;
  unit?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-[var(--color-text)]">{label}</span>
        <span className="text-sm font-bold text-[var(--color-primary)]">
          {value[0]}-{value[1]}{unit}
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <input
          type="number"
          min={min}
          max={value[1]}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="w-20 px-2 py-1.5 text-sm font-medium text-center bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => {
            const newMax = Number(e.target.value);
            onChange([Math.min(value[0], newMax), newMax]);
          }}
          className="flex-1"
        />
        <input
          type="number"
          min={value[0]}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="w-20 px-2 py-1.5 text-sm font-medium text-center bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-200">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
          checked
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${
            checked ? 'translate-x-6' : ''
          }`}
        >
          {checked && <span className="text-emerald-600 text-xs">✓</span>}
        </span>
      </button>
    </label>
  );
}

export function FilterPanel({
  filters,
  searchInput,
  activePreset,
  onUpdateFilter,
  onSelectPreset,
  onReset,
  stats,
  isOpen,
  onClose,
}: FilterPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-full md:h-auto
          w-80 bg-white md:bg-transparent
          z-50 md:z-auto flex-shrink-0
          transform transition-transform duration-300 md:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="p-6 md:sticky md:top-6 space-y-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between md:hidden">
            <h2 className="font-display text-xl">Фильтры</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none z-10 transition-colors group-focus-within:text-[var(--color-primary)]"
            />
            <input
              type="text"
              placeholder="Поиск продукта..."
              value={searchInput}
              onChange={(e) => onUpdateFilter('search', e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white/90 backdrop-blur-sm border-2 border-[var(--color-border)] rounded-2xl text-sm font-medium placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
            />
            {searchInput && (
              <button
                onClick={() => onUpdateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-primary)] rounded-lg transition-all duration-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
              Быстрый выбор
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => onSelectPreset(activePreset === preset.key ? null : preset.key)}
                  className={`
                    inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                    border-2 transition-all duration-300 relative overflow-hidden
                    ${
                      activePreset === preset.key
                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/30 scale-105'
                        : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md hover:scale-105'
                    }
                  `}
                  title={preset.description}
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="hidden sm:inline">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
              Категории
            </h3>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag];
                    onUpdateFilter('tags', newTags);
                  }}
                  className={`
                    px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-300
                    ${
                      filters.tags.includes(tag)
                        ? 'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-dark)] text-white border-[var(--color-secondary)] shadow-lg shadow-[var(--color-secondary)]/30 scale-105'
                        : 'bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:shadow-md hover:scale-105'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* КБЖУ Sliders */}
          <div className="space-y-5 p-5 bg-gradient-to-br from-white to-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Нутриенты на 100г
            </h3>

            <RangeSlider
              label="🔥 Калории"
              value={filters.caloriesRange}
              min={0}
              max={500}
              onChange={(v) => onUpdateFilter('caloriesRange', v)}
              unit=" ккал"
            />

            <RangeSlider
              label="💪 Белок"
              value={filters.proteinRange}
              min={0}
              max={100}
              onChange={(v) => onUpdateFilter('proteinRange', v)}
              unit="г"
            />

            <RangeSlider
              label="🧈 Жиры"
              value={filters.fatRange}
              min={0}
              max={100}
              onChange={(v) => onUpdateFilter('fatRange', v)}
              unit="г"
            />

            <RangeSlider
              label="🍞 Углеводы"
              value={filters.carbsRange}
              min={0}
              max={100}
              onChange={(v) => onUpdateFilter('carbsRange', v)}
              unit="г"
            />
          </div>
          
          {/* Advanced toggles */}
          <div className="space-y-4 p-5 bg-gradient-to-br from-white to-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Дополнительно
            </h3>

            <Toggle
              label="🥑 Low-carb (< 10г углеводов)"
              checked={filters.isLowCarb}
              onChange={(v) => onUpdateFilter('isLowCarb', v)}
            />

            <Toggle
              label="💪 High-protein (> 20г белка)"
              checked={filters.isHighProtein}
              onChange={(v) => onUpdateFilter('isHighProtein', v)}
            />

            <Toggle
              label="🔬 Проверено в лаборатории"
              checked={filters.labTestedOnly}
              onChange={(v) => onUpdateFilter('labTestedOnly', v)}
            />
          </div>
          
          {/* Sort */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
              Сортировка
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={filters.sortBy}
                  onChange={(e) => onUpdateFilter('sortBy', e.target.value as SortOption)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 bg-white border border-[var(--color-border)] rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                />
              </div>
              <button
                onClick={() =>
                  onUpdateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
                }
                className="px-4 py-2.5 bg-white border border-[var(--color-border)] rounded-xl text-sm font-bold hover:border-[var(--color-primary)] transition-colors"
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          {stats.filtered > 0 && (
            <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                Средние значения ({stats.filtered} продуктов)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl">
                  <div className="text-lg font-bold text-orange-600">{stats.avgCalories}</div>
                  <div className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase">ккал</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl">
                  <div className="text-lg font-bold text-blue-600">{stats.avgProtein}г</div>
                  <div className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase">Белок</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl">
                  <div className="text-lg font-bold text-yellow-600">{stats.avgFat}г</div>
                  <div className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase">Жиры</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl">
                  <div className="text-lg font-bold text-green-600">{stats.avgCarbs}г</div>
                  <div className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase">Углеводы</div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl text-center">
                <div className="text-lg font-bold text-purple-600">{stats.avgProteinPerCalorie}г</div>
                <div className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase">Белок/100ккал</div>
              </div>
            </div>
          )}

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {copied ? (
              <>
                <Check size={16} />
                Ссылка скопирована!
              </>
            ) : (
              <>
                <Share2 size={16} />
                Поделиться фильтрами
              </>
            )}
          </button>

          {/* Stats & Reset */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div className="text-sm">
              <span className="font-bold text-[var(--color-primary)]">{stats.filtered}</span>
              <span className="text-[var(--color-text-muted)]"> из {stats.total}</span>
            </div>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <RotateCcw size={16} />
              Сбросить
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
