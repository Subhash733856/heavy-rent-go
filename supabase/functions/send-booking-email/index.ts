import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  bookingDetails: {
    equipmentName: string;
    clientName: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    status: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, bookingDetails }: EmailRequest = await req.json();
    
    console.log(`Sending email to ${to} about booking for ${bookingDetails.equipmentName}`);
    
    // Email functionality placeholder - user needs to configure Resend
    // For now, just log the email details
    const emailContent = {
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Booking ${bookingDetails.status === 'confirmed' ? 'Confirmed' : 'Update'}</h1>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Booking Details</h2>
            <p><strong>Equipment:</strong> ${bookingDetails.equipmentName}</p>
            <p><strong>Client:</strong> ${bookingDetails.clientName}</p>
            <p><strong>Start:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
            <p><strong>End:</strong> ${new Date(bookingDetails.endTime).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount.toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">${bookingDetails.status.toUpperCase()}</span></p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Thank you for using Heavy Rent Go!</p>
        </div>
      `
    };

    console.log('Email would be sent:', emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification logged (configure Resend to actually send emails)',
        emailDetails: emailContent 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in send-booking-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
