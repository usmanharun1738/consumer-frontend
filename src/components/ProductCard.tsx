import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react'; // <-- removed Heart
import type { Product } from '../types';
import WishlistButton from './WishlistButton';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem.mutate({ product_id: product.id, quantity: 1 });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link to={`/products/${product.id}`}>
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Image</span>
                </div>
            </Link>
            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                        <WishlistButton productId={product.id} />
                        <button
                            onClick={handleAddToCart}
                            disabled={addItem.isPending || product.stock_quantity === 0} // <-- isPending
                            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
                {product.stock_quantity === 0 && (
                    <span className="text-xs text-red-500 font-medium">Out of stock</span>
                )}
            </div>
        </div>
    );
}