import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';

export default function Cart() {
    const { cartQuery, updateQuantity, removeItem } = useCart();
    const { data: cartItems, isLoading, error } = cartQuery;

    const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalPrice = cartItems?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

    if (isLoading) {
        return <div className="text-center py-12 text-gray-500">Loading your cart...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Failed to load cart. Please refresh the page.
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center py-16">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
                <h2 className="mt-4 text-xl font-medium text-gray-700">Your cart is empty</h2>
                <p className="mt-1 text-gray-500">Browse our products and add items you love.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cart items list */}
                <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            {/* Product info */}
                            <div className="flex-1">
                                <Link to={`/products/${item.product_id}`} className="font-medium text-gray-900 hover:text-blue-600">
                                    {item.name}
                                </Link>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity.mutate({ productId: item.product_id, quantity: item.quantity - 1 })}
                                    disabled={item.quantity <= 1 || updateQuantity.isPending}
                                    className="p-1 rounded border border-gray-300 disabled:opacity-50"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity.mutate({ productId: item.product_id, quantity: item.quantity + 1 })}
                                    disabled={updateQuantity.isPending || item.quantity >= item.stock}
                                    className="p-1 rounded border border-gray-300 disabled:opacity-50"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Subtotal and remove */}
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-gray-900 w-20 text-right">
                                    ${item.subtotal.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeItem.mutate(item.product_id)}
                                    disabled={removeItem.isPending}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Cart summary */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm text-gray-600">Total items: {totalItems}</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                            Total: ${totalPrice.toFixed(2)}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Link
                            to="/checkout"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}