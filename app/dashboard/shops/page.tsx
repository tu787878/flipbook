'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Store, BookOpen, Trash2, Edit } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    menus: number;
  };
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const response = await fetch('/api/shops');
      if (response.ok) {
        const data = await response.json();
        setShops(data.shops);
      }
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to delete this shop? All menus will be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShops(shops.filter((shop) => shop.id !== shopId));
      }
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Shops</h1>
          <p className="text-gray-700">Manage your shops and their menus</p>
        </div>
        <Link
          href="/dashboard/shops/new"
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Shop
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops yet</h3>
          <p className="text-gray-700 mb-6">Create your first shop to get started</p>
          <Link
            href="/dashboard/shops/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Shop
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Store className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/shops/${shop.id}`}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit shop"
                  >
                    <Edit className="w-4 h-4 text-gray-700" />
                  </Link>
                  <button
                    onClick={() => deleteShop(shop.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete shop"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
              {shop.description && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{shop.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <BookOpen className="w-4 h-4" />
                <span>{shop._count.menus} menu(s)</span>
              </div>

              <Link
                href={`/dashboard/shops/${shop.id}`}
                className="block w-full text-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Manage Shop
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

