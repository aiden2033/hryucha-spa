import { memo } from 'react';
import { Package } from 'lucide-react';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const LoadingSkeleton = memo(() => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card p-6 space-y-4">
          <div className="flex justify-between">
            <div className="space-y-3 flex-1">
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-7 w-24" />
            </div>
            <div className="skeleton h-14 w-20" />
          </div>
          <div className="space-y-3">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-full" />
          </div>
          <div className="skeleton h-10 w-full" />
        </div>
      ))}
    </div>
  );
});

const EmptyState = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-[var(--color-border)] rounded-full flex items-center justify-center mb-4">
        <Package size={32} className="text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">
        Ничего не найдено
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] text-center max-w-sm">
        Попробуйте изменить фильтры или сбросить их, чтобы увидеть все продукты
      </p>
    </div>
  );
});

const ProductGridComponent = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export const ProductGrid = memo(ProductGridComponent);
