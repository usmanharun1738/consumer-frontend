import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { products } from '../api/endpoints';
import { useCart } from '../hooks/useCart';
import WishlistButton from '../components/WishlistButton';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const productId = parseInt(id || '0', 10);

    const { addItem } = useCart();

    // Fetch product by ID
    const { data, isLoading, error } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => products.get(productId).then(res => res.data),
        enabled: !!productId && productId > 0, // Only run if ID is valid
        staleTime: 5 * 60 * 1000,
    });

    const handleAddToCart = () => {
        if (data) {
            addItem.mutate({ product_id: data.id, quantity: 1 });
        }
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading product...</div>;
    }

    if (error || !data) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Product not found</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    &larr; Back to shop
                </button>
            </div>
        );
    }

    const product = data;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 mb-6"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                    {/* Image placeholder */}
                    <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                    </div>

                    {/* Details */}
                    <div className="p-6 md:w-1/2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>

                        <p className="text-3xl font-bold text-blue-600 mb-4">
                            ${product.price.toFixed(2)}
                        </p>

                        <div className="mb-4">
                            <span className={`text-sm font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                            </span>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                            {product.description || 'No description available.'}
                        </p>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={addItem.isPending || product.stock_quantity === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>

                            <WishlistButton productId={product.id} size="lg" />
                        </div>

                        <p className="text-xs text-gray-400 mt-4">
                            Added: {new Date(product.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}