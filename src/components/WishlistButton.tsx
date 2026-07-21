import { Heart } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlist } from '../api/endpoints';

interface WishlistButtonProps {
    productId: number;
    size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ productId, size = 'md' }: WishlistButtonProps) {
    const queryClient = useQueryClient();

    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => wishlist.list().then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const isWishlisted = wishlistData?.some((item: any) => item.product_id === productId) ?? false;

    const mutation = useMutation({
        mutationFn: () =>
            isWishlisted
                ? wishlist.remove(productId)
                : wishlist.add(productId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['wishlist'] });
            const previousWishlist = queryClient.getQueryData(['wishlist']);
            queryClient.setQueryData(['wishlist'], (old: any) => {
                if (!old) return old;
                if (isWishlisted) {
                    return old.filter((item: any) => item.product_id !== productId);
                } else {
                    return [...old, { product_id: productId, id: Date.now() }];
                }
            });
            return { previousWishlist };
        },
        onError: (_err, _variables, context) => { // <-- prefix with _
            queryClient.setQueryData(['wishlist'], context?.previousWishlist);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const sizeClasses = {
        sm: 'p-1',
        md: 'p-2',
        lg: 'p-3',
    };

    const iconSize = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={`rounded-full hover:bg-gray-100 transition-colors ${sizeClasses[size]} ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
        >
            <Heart
                size={iconSize[size]}
                className={isWishlisted ? 'fill-current' : ''}
            />
        </button>
    );
}