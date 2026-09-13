import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

export const dynamic = 'force-dynamic';

function getDodoClient() {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) return null;
  return new DodoPayments({
    bearerToken: apiKey,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode',
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { spotId, spotLabel, spotSize, spotPrice, email, websiteUrl, logoUrl } = body as {
    spotId?: number;
    spotLabel?: string;
    spotSize?: string;
    spotPrice?: number;
    email?: string;
    websiteUrl?: string;
    logoUrl?: string;
  };

  if (!spotId || !spotLabel || !spotPrice || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const client = getDodoClient();
  if (!client) {
    return NextResponse.json(
      { error: 'Payment gateway configuration is missing (DODO_PAYMENTS_API_KEY).' },
      { status: 500 }
    );
  }

  try {
    // Create a product dynamically with the exact spot price
    const product = await client.products.create({
      name: `Spot #${spotId}: ${spotLabel}`,
      price: {
        currency: 'USD',
        price: spotPrice * 100, // Amount in cents
        type: 'one_time_price',
      },
      tax_category: 'digital_products',
    });

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create checkout session with the newly created product
    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: product.product_id,
          quantity: 1,
        },
      ],
      customer: { email },
      metadata: {
        spot_id: String(spotId),
        spot_label: spotLabel,
        spot_size: spotSize || '',
        spot_price: String(spotPrice),
        website_url: websiteUrl || '',
        logo_url: logoUrl || '',
      },
      return_url: `${origin}/checkout/success`,
    });

    return NextResponse.json({
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
