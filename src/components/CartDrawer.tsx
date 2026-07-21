import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { cartQuery, updateQuantity, removeItem } = useCart();
    const { data: cartItems, isLoading } = cartQuery;

    const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const totalPrice = cartItems?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Your Cart
                                            </Dialog.Title>
                                            <button
                                                onClick={onClose}
                                                className="rounded-md p-2 text-gray-400 hover:text-gray-500"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto px-4 py-6">
                                            {isLoading ? (
                                                <div className="text-center py-8 text-gray-500">Loading...</div>
                                            ) : cartItems && cartItems.length > 0 ? (
                                                <ul className="divide-y divide-gray-200">
                                                    {cartItems.map((item) => (
                                                        <li key={item.id} className="py-4 flex">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-medium text-gray-900">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    ${item.price.toFixed(2)} each
                                                                </p>
                                                                <div className="flex items-center mt-2 gap-2">
                                                                    <button
                                                                        onClick={() => updateQuantity.mutate({ productId: item.product_id, quantity: item.quantity - 1 })}
                                                                        disabled={item.quantity <= 1}
                                                                        className="p-1 rounded border border-gray-300 disabled:opacity-50"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => updateQuantity.mutate({ productId: item.product_id, quantity: item.quantity + 1 })}
                                                                        className="p-1 rounded border border-gray-300"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4 text-right">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    ${item.subtotal.toFixed(2)}
                                                                </p>
                                                                <button
                                                                    onClick={() => removeItem.mutate(item.product_id)}
                                                                    className="mt-1 text-xs text-red-500 hover:text-red-700"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                                                    <p className="mt-2 text-sm text-gray-500">Your cart is empty</p>
                                                </div>
                                            )}
                                        </div>

                                        {cartItems && cartItems.length > 0 && (
                                            <div className="border-t border-gray-200 px-4 py-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>${totalPrice.toFixed(2)}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">
                                                    Shipping and taxes calculated at checkout.
                                                </p>
                                                <div className="mt-6">
                                                    <Link
                                                        to="/checkout"
                                                        onClick={onClose}
                                                        className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                                                    >
                                                        Checkout
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}