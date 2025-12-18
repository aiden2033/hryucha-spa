import { RefreshCw, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-300 group-hover:shadow-[var(--color-primary)]/50 group-hover:scale-105 relative overflow-hidden">
              <span className="relative z-10 animate-float">🐷</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="font-display text-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                Хрюча
              </h1>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                Поиск ЗОЖ-продуктов
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white/80 backdrop-blur-sm border border-[var(--glass-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-white hover:shadow-md transition-all duration-300 disabled:opacity-50 group"
              title="Обновить данные"
            >
              <RefreshCw
                size={18}
                className={`text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>

            {/* Link to sheet */}
            <a
              href="https://docs.google.com/spreadsheets/d/1-9ZBfjg4LhWyH83BEv8EM95D8FrpnzUR0v9fsTtmHK0"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-[var(--glass-border)] rounded-xl text-sm font-semibold text-[var(--color-text)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] hover:shadow-md hover:bg-white transition-all duration-300"
            >
              <ExternalLink size={16} />
              Таблица
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
