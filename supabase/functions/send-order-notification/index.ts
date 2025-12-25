import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  newStatus: string;
  customerEmail: string;
  customerName: string;
  orderTotal: number;
}

const statusMessages: Record<string, { subject: string; message: string; color: string }> = {
  pending: {
    subject: "Order Received",
    message: "We've received your order and it's being reviewed.",
    color: "#f59e0b"
  },
  confirmed: {
    subject: "Order Confirmed",
    message: "Great news! Your order has been confirmed and is being prepared.",
    color: "#3b82f6"
  },
  processing: {
    subject: "Order Processing",
    message: "Your order is currently being processed and will be shipped soon.",
    color: "#14b8a6"
  },
  shipped: {
    subject: "Order Shipped",
    message: "Your order is on its way! It has been shipped and will reach you soon.",
    color: "#8b5cf6"
  },
  delivered: {
    subject: "Order Delivered",
    message: "Your order has been delivered successfully. Thank you for shopping with us!",
    color: "#22c55e"
  },
  cancelled: {
    subject: "Order Cancelled",
    message: "Your order has been cancelled. If you have any questions, please contact support.",
    color: "#ef4444"
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, newStatus, customerEmail, customerName, orderTotal }: OrderNotificationRequest = await req.json();

    console.log(`Sending order notification for order ${orderId} - Status: ${newStatus}`);

    const statusConfig = statusMessages[newStatus] || statusMessages.pending;
    const orderIdShort = orderId.slice(0, 8).toUpperCase();

    const emailResponse = await resend.emails.send({
      from: "JeevanRaksha <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `${statusConfig.subject} - Order #${orderIdShort}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">JeevanRaksha</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Your Healthcare Companion</p>
              </div>
              
              <!-- Status Badge -->
              <div style="padding: 32px 32px 0 32px; text-align: center;">
                <div style="display: inline-block; background: ${statusConfig.color}; color: white; padding: 8px 24px; border-radius: 100px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${newStatus}
                </div>
              </div>
              
              <!-- Content -->
              <div style="padding: 24px 32px 32px 32px;">
                <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px;">
                  Hello ${customerName || 'Valued Customer'},
                </h2>
                <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
                  ${statusConfig.message}
                </p>
                
                <!-- Order Details Card -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="color: #64748b; font-size: 14px;">Order ID</span>
                    <span style="color: #1e293b; font-weight: 600; font-size: 14px;">#${orderIdShort}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-size: 14px;">Total Amount</span>
                    <span style="color: #3b82f6; font-weight: 700; font-size: 16px;">₹${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <p style="color: #94a3b8; font-size: 14px; margin: 0; text-align: center;">
                  If you have any questions, please don't hesitate to contact our support team.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} JeevanRaksha. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
