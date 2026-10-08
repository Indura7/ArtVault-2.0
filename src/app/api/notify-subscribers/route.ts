import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; 
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email');

    if (error) throw error;
    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found.' }, { status: 200 });
    }

    const emailList = subscribers.map(sub => sub.email);


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: emailList,
      subject: 'New Artwork Alert at Art Vault!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #6b21a8;">Fresh Inspiration has Arrived!</h2>
          <p>A brand new masterpiece was just approved and added to the gallery.</p>
          <p>Check it out now and be inspired!</p>
        </div>
      `,
    };

    
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: `Successfully notified ${emailList.length} subscribers!` }, { status: 200 });

  } catch (error) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: 'Failed to send broadcast' }, { status: 500 });
  }
}