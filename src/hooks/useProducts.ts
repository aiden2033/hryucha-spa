import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/sheets';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 30 * 60 * 1000, // 30 минут (бывший cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
