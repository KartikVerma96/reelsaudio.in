import { NextResponse } from 'next/server';

/**
 * WhatsApp Contact API
 * Hides the WhatsApp number from client-side code
 * Number is stored in environment variable for security
 */

// WhatsApp number from environment variable (server-side only)
// Set in .env.local: WHATSAPP_NUMBER=919694768702
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '919694768702';

export async function POST(request) {
  try {
    const { name, message } = await request.json();
    
    // Construct WhatsApp URL with pre-filled message
    const whatsappMessage = `Hello ReelsAudio.in!\n\nName: ${name || 'User'}\nMessage: ${message || 'I have a question'}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Return URL instead of redirect (client will handle opening)
    // This way the number is never exposed in client-side code
    return NextResponse.json({
      success: true,
      whatsappUrl,
    });
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate WhatsApp link' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'User';
    const message = searchParams.get('message') || 'Hello ReelsAudio.in';
    
    // Construct WhatsApp URL
    const whatsappMessage = `Hello ReelsAudio.in!\n\nName: ${name}\nMessage: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Redirect directly to WhatsApp
    return NextResponse.redirect(whatsappUrl);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate WhatsApp link' },
      { status: 500 }
    );
  }
}

