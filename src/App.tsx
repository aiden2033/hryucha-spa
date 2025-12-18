import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './hooks/useProducts';
import { useFilters } from './hooks/useFilters';
import { Header, FilterPanel, ProductGrid } from './components';
import { AlertCircle } from 'lucide-react';
import { countActiveFilters } from './utils/filterHelpers';

const queryClient = new QueryClient();

function AppContent() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const { data: products = [], isLoading, isError, error, refetch, isFetching } = useProducts();
  
  const {
    filters,
    activePreset,
    searchInput,
    updateFilter,
    selectPreset,
    resetFilters,
    filteredProducts,
    stats,
  } = useFilters(products);

  const activeFiltersCount = useMemo(() => countActiveFilters(filters), [filters]);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md card p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
            Ошибка загрузки
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            {error instanceof Error ? error.message : 'Не удалось загрузить данные из таблицы'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-8">
          {/* Filter Panel - Unified for desktop and mobile */}
          <FilterPanel
            filters={filters}
            searchInput={searchInput}
            activePreset={activePreset}
            onUpdateFilter={updateFilter}
            onSelectPreset={selectPreset}
            onReset={resetFilters}
            stats={stats}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-white/80 via-[var(--color-bg)] to-white/80 backdrop-blur-sm rounded-2xl border border-[var(--glass-border)] shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  Продукты
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Найдено: <span className="font-bold text-[var(--color-primary)] text-lg">{stats.filtered}</span> <span className="text-xs">из {stats.total}</span>
                </p>
              </div>

              {/* Mobile filter button with badge */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="md:hidden px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-white text-[var(--color-primary)] rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            <ProductGrid products={filteredProducts} isLoading={isLoading} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 py-8 bg-gradient-to-r from-white/60 via-[var(--color-bg)] to-white/60 backdrop-blur-sm border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            🐷 Хрюча — поиск ЗОЖ-продуктов для спортсменов
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Данные загружаются из Google Sheets в реальном времени
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
