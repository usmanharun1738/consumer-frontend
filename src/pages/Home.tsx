import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { products } from '../api/endpoints';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import type { Product } from '../types';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', searchQuery],
        queryFn: () => products.list(searchQuery).then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-gray-500">Loading products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-8">
                Failed to load products. Please try again later.
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSearch} className="mb-8 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            {data && data.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No products found. Try a different search term.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.map((product: Product) => ( // <-- type added
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}