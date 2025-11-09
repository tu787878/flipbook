import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { shopSlug: string; menuSlug: string } }
) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug: params.shopSlug },
      include: {
        menus: {
          where: { slug: params.menuSlug, published: true },
          include: {
            pages: {
              orderBy: { pageNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!shop || shop.menus.length === 0) {
      return NextResponse.json(
        { error: 'Menu not found or not published' },
        { status: 404 }
      );
    }

    const menu = shop.menus[0];

    return NextResponse.json({
      menu: {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        settings: menu.settings,
        pages: menu.pages,
        shop: {
          name: shop.name,
          slug: shop.slug,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

