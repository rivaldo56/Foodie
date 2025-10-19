import { NextRequest, NextResponse } from 'next/server';
import { indexChefs, indexDishes } from '@/lib/ai/rag';

// Admin route to index vectors for RAG
// In production, add authentication and rate limiting
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();

    // TODO: Add admin authentication check here
    // For now, this should be called manually or via cron job

    let indexed = 0;

    if (type === 'chefs' || type === 'all') {
      const chefsIndexed = await indexChefs();
      indexed += chefsIndexed;
      console.log(`Indexed ${chefsIndexed} chefs`);
    }

    if (type === 'dishes' || type === 'all') {
      const dishesIndexed = await indexDishes();
      indexed += dishesIndexed;
      console.log(`Indexed ${dishesIndexed} dishes`);
    }

    return NextResponse.json({
      success: true,
      indexed,
      message: `Successfully indexed ${indexed} items`,
    });
  } catch (error) {
    console.error('Index vectors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
