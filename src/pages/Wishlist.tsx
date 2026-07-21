import { useQuery } from '@tanstack/react-query';
import { wishlist } from '../api/endpoints';
import { useCart } from '../hooks/useCart';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import WishlistButton from '../components/WishlistButton';
import type { WishlistItem } from '../types';

export default function Wishlist() {
    const { data: wishlistItems, isLoading, error } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => wishlist.list().then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const { addItem } = useCart();

    const handleAddToCart = (productId: number) => {
        addItem.mutate({ product_id: productId, quantity: 1 });
    };

    if (isLoading) {
        return <div className="text-center py-12 text-gray-500">Loading wishlist...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Failed to load wishlist. Please try again.
            </div>
        );
    }

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="text-center py-16">
                <Heart className="mx-auto h-16 w-16 text-gray-300" />
                <h2 className="mt-4 text-xl font-medium text-gray-700">Your wishlist is empty</h2>
                <p className="mt-1 text-gray-500">Start saving your favourite products.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item: WishlistItem) => ( // <-- type added
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                        <Link to={`/products/${item.product_id}`}>
                            <div className="h-40 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">Image</span>
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/products/${item.product_id}`}>
                                <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition">
                                    {item.name}
                                </h3>
                            </Link>
                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">
                                    ${item.price.toFixed(2)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item.product_id)}
                                        disabled={addItem.isPending || item.stock_quantity === 0}
                                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                    <WishlistButton productId={item.product_id} />
                                </div>
                            </div>
                            {item.stock_quantity === 0 && (
                                <span className="text-xs text-red-500 font-medium">Out of stock</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}