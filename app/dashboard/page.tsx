'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store, BookOpen, Plus, TrendingUp } from 'lucide-react';

interface Stats {
  totalShops: number;
  totalMenus: number;
  totalPages: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalShops: 0, totalMenus: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/shops');
      if (response.ok) {
        const data = await response.json();
        const totalShops = data.shops.length;
        const totalMenus = data.shops.reduce((acc: number, shop: any) => acc + shop._count.menus, 0);
        
        setStats({
          totalShops,
          totalMenus,
          totalPages: 0, // You can calculate this if needed
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-700">Manage your flipbook shops and menus</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Store className="w-8 h-8 text-purple-600" />}
          title="Total Shops"
          value={stats.totalShops}
          loading={loading}
        />
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-blue-600" />}
          title="Total Menus"
          value={stats.totalMenus}
          loading={loading}
        />
        <StatCard
          icon={<TrendingUp className="w-8 h-8 text-green-600" />}
          title="Total Pages"
          value={stats.totalPages}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/shops/new"
            className="flex items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 group-hover:bg-purple-600 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Create New Shop</h3>
              <p className="text-sm text-gray-700">Set up a new shop for your business</p>
            </div>
          </Link>

          <Link
            href="/dashboard/shops"
            className="flex items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
              <BookOpen className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Browse Shops</h3>
              <p className="text-sm text-gray-700">View and manage your existing shops</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}

