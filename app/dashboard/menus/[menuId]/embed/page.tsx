'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Code } from 'lucide-react';
import { generateEmbedCode } from '@/lib/utils';

interface Menu {
  id: string;
  name: string;
  slug: string;
  shop: {
    name: string;
    slug: string;
  };
}

export default function EmbedCodePage() {
  const params = useParams();
  const menuId = params.menuId as string;

  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (menuId) {
      loadMenu();
    }
  }, [menuId]);

  const loadMenu = async () => {
    try {
      const response = await fetch(`/api/menus/${menuId}`);
      if (response.ok) {
        const data = await response.json();
        setMenu(data.menu);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const embedCode = menu ? generateEmbedCode(menu.shop.slug, menu.slug) : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!menu) {
    return <div>Menu not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href={`/dashboard/shops/${menu.shop.slug}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <Code className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Embed Code</h1>
            <p className="text-gray-600">{menu.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">How to Embed</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Copy the embed code below</li>
              <li>Paste it into your website's HTML where you want the flipbook to appear</li>
              <li>The flipbook will automatically load and be fully interactive</li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Embed Code</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Customization Options</h3>
            <p className="text-sm text-blue-800 mb-3">
              You can customize the embed code by modifying these attributes:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><code className="bg-blue-100 px-1 rounded">width</code> - Set custom width (e.g., "800px", "100%")</li>
              <li><code className="bg-blue-100 px-1 rounded">height</code> - Set custom height (e.g., "600px", "800px")</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Preview Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/embed/${menu.shop.slug}/${menu.slug}`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              />
              <Link
                href={`/embed/${menu.shop.slug}/${menu.slug}`}
                target="_blank"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Open
              </Link>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes</h3>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>The menu must be published for the embed to work</li>
              <li>Changes to your menu will reflect automatically in embedded versions</li>
              <li>The flipbook works on all modern browsers and is mobile-responsive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

