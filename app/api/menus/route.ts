import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, shopId, pages } = await request.json();

    if (!name || !shopId) {
      return NextResponse.json(
        { error: 'Menu name and shop ID are required' },
        { status: 400 }
      );
    }

    // Verify shop ownership
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop || shop.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let slug = generateSlug(name);

    // Ensure unique slug within shop
    let counter = 1;
    let uniqueSlug = slug;
    while (
      await prisma.menu.findUnique({
        where: { shopId_slug: { shopId, slug: uniqueSlug } },
      })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const menu = await prisma.menu.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        shopId,
        pages: pages
          ? {
              create: pages.map((page: any, index: number) => ({
                pageNumber: index + 1,
                imageUrl: page.imageUrl,
                thumbnail: page.thumbnail,
              })),
            }
          : undefined,
      },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    });

    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}

