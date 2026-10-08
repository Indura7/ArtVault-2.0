import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'black4allu@gmail.com', 
      subject: '🎨 Art Vault System: Webhook Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Art Vault Notifications are Live! 🚀</h2>
          <p>If you are reading this, your Next.js server successfully connected to the Gmail SMTP server.</p>
          <p>Ready to build the artwork upload alerts!</p>
        </div>
      `,
    };

    
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });

  } catch (error) {
    console.error("SMTP Error:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}