import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // 1. Fetch all emails from the subscribers table
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email');

    if (error) throw error;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found.' }, { status: 200 });
    }

    // 2. Extract into a simple array of strings: ['test1@gmail.com', 'test2@gmail.com']
    const emailList = subscribers.map(sub => sub.email);

    // 3. Connect to Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // 4. Configure the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: emailList, // 👈 BCC ensures privacy! Customers cannot see each other.
      subject: '🎨 New Artwork Alert at Art Vault!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #6b21a8;">Fresh Inspiration has Arrived!</h2>
          <p>A brand new masterpiece was just approved and added to the gallery.</p>
          
        </div>
      `,
    };

    // 5. Send the broadcast
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: `Successfully notified ${emailList.length} subscribers!` }, { status: 200 });

  } catch (error) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}