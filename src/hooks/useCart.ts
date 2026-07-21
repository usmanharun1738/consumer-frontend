import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cart } from '../api/endpoints';

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: () => cart.list().then(res => res.data),
    staleTime: 2 * 60 * 1000,
  });

  const addItem = useMutation({
    mutationFn: cart.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: cart.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cart.add({ product_id: productId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return { cartQuery, addItem, removeItem, updateQuantity };
}