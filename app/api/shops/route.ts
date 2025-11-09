import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shops = await prisma.shop.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { menus: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ shops });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, logo } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Shop name is required' },
        { status: 400 }
      );
    }

    let slug = generateSlug(name);
    
    // Ensure unique slug
    let counter = 1;
    let uniqueSlug = slug;
    while (await prisma.shop.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const shop = await prisma.shop.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        logo,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    );
  }
}

