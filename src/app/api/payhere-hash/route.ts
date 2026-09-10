import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. Get the order details from your frontend
    const { order_id, amount, currency } = await request.json();

    // 2. Your PayHere Credentials (Keep these safe!)
    const merchant_id = "1237631"; // Replace with your ID
    const merchant_secret = "ODAwNTM5NTA0MzYxMDM2OTY5MDM0MDE2NDQ5MTM1NDgzOTg3OA=="; // Get this from PayHere Dashboard

    // 3. Format the amount to exactly 2 decimal places (e.g., 9000.00)
    const formattedAmount = parseFloat(amount).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2, 
      useGrouping: false 
    });

    // 4. Generate the MD5 Hashes according to PayHere documentation!
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    const hashString = merchant_id + order_id + formattedAmount + currency + hashedSecret;
    const finalHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    // 5. Send the secure hash back to the frontend
    return NextResponse.json({ hash: finalHash });

  } catch (error) {
    return NextResponse.json({ error: "Failed to generate hash" }, { status: 500 });
  }
}