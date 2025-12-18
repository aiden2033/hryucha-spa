import { memo } from 'react';
import { Star, ExternalLink, FlaskConical } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  index: number;
}

const TAG_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  'Мясо': { bg: 'bg-red-50', text: 'text-red-700', emoji: '🥩' },
  'Сласть': { bg: 'bg-pink-50', text: 'text-pink-700', emoji: '🍰' },
  'Творог': { bg: 'bg-blue-50', text: 'text-blue-700', emoji: '🥛' },
  'Колбаса': { bg: 'bg-amber-50', text: 'text-amber-700', emoji: '🌭' },
  'Другое': { bg: 'bg-gray-50', text: 'text-gray-700', emoji: '📦' },
};

function NutritionBar({
  value,
  max,
  color,
  label
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold w-5 text-[var(--color-text)]">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
        <div
          className={`h-full rounded-full transition-all duration-300 shadow-sm ${color} relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </div>
      </div>
      <span className="text-sm font-bold w-10 text-right text-[var(--color-text)]">{value}г</span>
    </div>
  );
}

function TasteStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={`${
            i < fullStars 
              ? 'text-amber-400 fill-amber-400' 
              : i === fullStars && hasHalfStar
                ? 'text-amber-400 fill-amber-400 opacity-50'
                : 'text-gray-200'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-[var(--color-text-muted)]">
        {rating}/10
      </span>
    </div>
  );
}

const ProductCardComponent = ({ product, index }: ProductCardProps) => {
  const tagStyle = TAG_STYLES[product.tag] || TAG_STYLES['Другое'];

  return (
    <div
      className="card p-10 animate-fade-in-up flex flex-col shadow-md hover:shadow-xl"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight mb-3 text-[var(--color-text)] transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${tagStyle.bg} ${tagStyle.text} transition-all duration-300 shadow-sm`}>
              <span>{tagStyle.emoji}</span>
              {product.tag}
            </span>
            {product.labTested && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide shadow-md shadow-emerald-500/30 group-hover:shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300">
                <FlaskConical size={11} />
                Проверено
              </span>
            )}
          </div>
        </div>

        {/* Калории - крупно */}
        <div className="text-right flex-shrink-0 relative">
          <div className="text-4xl font-extrabold bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent transition-transform duration-300">
            {product.calories}
          </div>
          <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
            ккал/100г
          </div>
        </div>
      </div>

      {/* Nutrition Bars */}
      <div className="space-y-2.5 mb-4">
        <NutritionBar value={product.protein} max={40} color="bg-blue-500" label="Б" />
        <NutritionBar value={product.fat} max={30} color="bg-yellow-500" label="Ж" />
        <NutritionBar value={product.carbs} max={50} color="bg-green-500" label="У" />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between py-3 px-4 -mx-3 bg-gradient-to-r from-[var(--color-bg)] via-white/50 to-transparent rounded-xl border border-[var(--color-border)]/30 transition-all duration-300">
        <div className="flex items-center gap-6">
          {/* Protein per calorie */}
          <div>
            <div className="text-lg font-bold text-blue-600 transition-colors duration-300">
              {product.proteinPerCalorie}г
            </div>
            <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Б/100ккал
            </div>
          </div>

          {/* Price */}
          {product.price !== null && (
            <div>
              <div className="text-lg font-bold text-[var(--color-text)] transition-colors duration-300">
                {product.price}₽
              </div>
              <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Цена
              </div>
            </div>
          )}
        </div>

        {/* Taste */}
        <TasteStars rating={product.taste} />
      </div>

      {/* Links */}
      {product.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 mt-auto">
          {product.links.slice(0, 2).map((link, i) => {
            const domain = new URL(link).hostname.replace('www.', '').split('.')[0];
            return (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border-2 border-[var(--color-border)] rounded-xl text-xs font-bold text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-lg hover:scale-105 hover:bg-white transition-all duration-300"
              >
                <ExternalLink size={14} />
                {domain}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ProductCard = memo(ProductCardComponent);
