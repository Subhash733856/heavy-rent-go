import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb; margin-bottom: 20px;">Booking ${bookingDetails.status === 'confirmed' ? 'Confirmed' : 'Update'}</h1>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Booking Details</h2>
          <p><strong>Equipment:</strong> ${bookingDetails.equipmentName}</p>
          <p><strong>Client:</strong> ${bookingDetails.clientName}</p>
          <p><strong>Start:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
          <p><strong>End:</strong> ${new Date(bookingDetails.endTime).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount.toLocaleString()}</p>
          <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">${bookingDetails.status.toUpperCase()}</span></p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Thank you for using Heavy Rent Go!</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Heavy Rent Go - Your trusted equipment rental platform</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: 'Heavy Rent Go <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: emailResponse.id 
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
