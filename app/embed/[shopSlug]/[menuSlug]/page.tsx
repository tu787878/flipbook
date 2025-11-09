import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FlipBookResponsive from '@/components/FlipBook/FlipBookResponsive';

interface PageProps {
  params: {
    shopSlug: string;
    menuSlug: string;
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const menu = await prisma.menu.findUnique({
    where: {
      shopId_slug: {
        shopId: params.shopSlug,
        slug: params.menuSlug,
      },
    },
    include: {
      shop: true,
      pages: {
        orderBy: { pageNumber: 'asc' },
      },
    },
  });

  // Try to find by shop slug
  if (!menu) {
    const shop = await prisma.shop.findUnique({
      where: { slug: params.shopSlug },
      include: {
        menus: {
          where: { slug: params.menuSlug },
          include: {
            pages: {
              orderBy: { pageNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!shop || shop.menus.length === 0) {
      notFound();
    }

    const foundMenu = shop.menus[0];

    return (
      <div className="h-screen w-full">
        <FlipBookResponsive
          pages={foundMenu.pages}
          shopName={shop.name}
          menuName={foundMenu.name}
          settings={foundMenu.settings as any}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <FlipBookResponsive
        pages={menu.pages}
        shopName={menu.shop.name}
        menuName={menu.name}
        settings={menu.settings as any}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const shop = await prisma.shop.findUnique({
    where: { slug: params.shopSlug },
    include: {
      menus: {
        where: { slug: params.menuSlug },
      },
    },
  });

  if (!shop || shop.menus.length === 0) {
    return {
      title: 'Menu Not Found',
    };
  }

  const menu = shop.menus[0];

  return {
    title: `${menu.name} - ${shop.name}`,
    description: menu.description || `View ${menu.name} from ${shop.name}`,
  };
}

