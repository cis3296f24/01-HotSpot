import { Resend } from "resend";

export async function POST(req) {
    try {
      console.log("Incoming Request:", req);
  
      // Safely parse JSON body
      const body = await req.json().catch(() => ({}));
      console.log("Parsed Body:", body);
  
      // Extract and validate event details
      const { eventName, eventDate, eventTime, eventLocation } = body;
  
      if (!eventName || !eventDate || !eventTime || !eventLocation) {
        return new Response(
          JSON.stringify({ error: "Missing required event details" }),
          { status: 400 }
        );
      }
  
      // Email logic
      const resendAPI = new Resend('re_4qREgemo_9RA3kRA5GsCeES3YSHf3Ytne');
      const emailResponse = await resendAPI.emails.send({
        from: 'onboarding@resend.dev',
        to: ['tuo44543@temple.edu'],
        subject: `Hotspot - New Event Created: ${eventName}`,
        text: `Event Details:\n\nName: ${eventName}\nDate: ${eventDate}\nTime: ${eventTime}\nLocation: ${eventLocation}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Thank You for Creating Your Event on Hotspot!</h2>
            <p>Hi there,</p>
            <p>Thank you for using <strong>Hotspot</strong> to create your event. Just to confirm, here are the details of your event:</p>
            <table style="width: 100%; max-width: 600px; margin: 20px auto; border-collapse: collapse; text-align: left; border: 1px solid #ddd;">
                <thead>
                <tr style="background-color: #f4f4f4;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Event Details</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Information</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Name</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${eventName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Date</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${eventDate}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Time</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${eventTime}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Location</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${eventLocation}</td>
                </tr>
                </tbody>
            </table>
            <p>If any of these details are incorrect, please contact us to update your event information.</p>
            <p>We look forward to seeing your event come to life!</p>
            <p style="color: #888;">- The Hotspot Team</p>
            </div>
        `,
      });
  
      if (!emailResponse) {
        throw new Error("Failed to send email");
      }
  
      return new Response(
        JSON.stringify({ message: "Email sent successfully!" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in sendEmail API:", error);
      return new Response(
        JSON.stringify({ error: "Unexpected server error", details: error.message }),
        { status: 500 }
      );
    }
  }
  