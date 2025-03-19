import type { Handler } from "@netlify/functions";
import mailjet from "node-mailjet";

const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY!
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { name, email } = JSON.parse(event.body || "{}");

    if (!name || !email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Valid name and email are required" }),
      };
    }

    // Send email to admin
    await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: ADMIN_EMAIL, Name: "EcoSearch" },
          To: [{ Email: ADMIN_EMAIL }],
          Subject: "New Waitlist Signup",
          HTMLPart: `
            <h1>New Waitlist Signup</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p>This user has joined the EcoSearch waitlist.</p>
          `,
        },
      ],
    });

    // Send confirmation email to user
    await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: ADMIN_EMAIL, Name: "EcoSearch" },
          To: [{ Email: email }],
          Subject: "Welcome to the EcoSearch Waitlist!",
          HTMLPart: `
            <h1>Welcome to the EcoSearch Waitlist!</h1>
            <p>Hello ${name},</p>
            <p>Thank you for joining the EcoSearch waitlist! We're excited to have you on board.</p>
            <p>EcoSearch is the world's first Green AI Search Engine, combining cutting-edge AI technology with a commitment to sustainability.</p>
            <p>We'll keep you updated on our progress and let you know when you can start using EcoSearch.</p>
            <p>Best regards,<br>The EcoSearch Team</p>
          `,
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully joined waitlist" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export { handler };
