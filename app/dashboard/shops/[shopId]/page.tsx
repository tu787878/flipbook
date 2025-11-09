'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, BookOpen, Eye, Code, Trash2, Edit } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

interface Menu {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  _count: {
    pages: number;
  };
}

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  menus: Menu[];
}

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [creatingMenu, setCreatingMenu] = useState(false);
  const [uploadedPages, setUploadedPages] = useState<any[]>([]);
  const [currentMenuId, setCurrentMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (shopId) {
      loadShop();
    }
  }, [shopId]);

  const loadShop = async () => {
    try {
      const response = await fetch(`/api/shops/${shopId}`);
      if (response.ok) {
        const data = await response.json();
        setShop(data.shop);
      }
    } catch (error) {
      console.error('Error loading shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async () => {
    if (!menuName) return;

    setCreatingMenu(true);
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: menuName,
          description: menuDescription,
          shopId,
          pages: uploadedPages,
        }),
      });

      if (response.ok) {
        setShowCreateMenu(false);
        setMenuName('');
        setMenuDescription('');
        setUploadedPages([]);
        setCurrentMenuId(null);
        loadShop();
      }
    } catch (error) {
      console.error('Error creating menu:', error);
    } finally {
      setCreatingMenu(false);
    }
  };

  const deleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) {
      return;
    }

    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadShop();
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!shop) {
    return <div>Shop not found</div>;
  }

  return (
    <div>
      <Link
        href="/dashboard/shops"
        className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shops
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
          {shop.description && <p className="text-gray-700">{shop.description}</p>}
        </div>
        <button
          onClick={() => setShowCreateMenu(true)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Menu
        </button>
      </div>

      {/* Create Menu Modal */}
      {showCreateMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Menu</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Name *
                </label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Dinner Menu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Pages (PDF or Images)
                </label>
                <FileUpload
                  menuId={currentMenuId || 'temp'}
                  onUploadComplete={(pages) => {
                    setUploadedPages(pages);
                  }}
                  onUploadError={(error) => {
                    alert(error);
                  }}
                />
                {uploadedPages.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {uploadedPages.length} page(s) uploaded
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCreateMenu}
                  disabled={!menuName || uploadedPages.length === 0 || creatingMenu}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingMenu ? 'Creating...' : 'Create Menu'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateMenu(false);
                    setMenuName('');
                    setMenuDescription('');
                    setUploadedPages([]);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menus List */}
      {shop.menus.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No menus yet</h3>
          <p className="text-gray-700 mb-6">Create your first menu to get started</p>
          <button
            onClick={() => setShowCreateMenu(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Menu
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shop.menus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <button
                  onClick={() => deleteMenu(menu.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{menu.name}</h3>
              {menu.description && (
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{menu.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{menu._count.pages} page(s)</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    menu.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {menu.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/embed/${shop.slug}/${menu.slug}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Link>
                <Link
                  href={`/dashboard/menus/${menu.id}/embed`}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  title="Get embed code"
                >
                  <Code className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

