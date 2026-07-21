import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // <-- changed
import { useCart } from '../hooks/useCart';
import CartDrawer from './CartDrawer';
import type { CartItem } from '../types';

export default function Layout() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user, logout } = useAuth(); // <-- now user exists
    const { cartQuery } = useCart();
    const navigate = useNavigate();

    // Fix: type the reduce parameters
    const totalItems = cartQuery.data?.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
    ) || 0;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                        CartSystem
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/wishlist" className="text-gray-600 hover:text-blue-600">
                            Wishlist
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <ShoppingCart size={24} className="text-gray-600" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        {user ? (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <LogOut size={18} className="text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-1 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <User size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} CartSystem. All rights reserved.
                </div>
            </footer>
        </div>
    );
}