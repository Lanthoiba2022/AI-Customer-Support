// components/Chat.tsx
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const systemPrompt = `
  You are a helpful and knowledgeable customer support assistant for Headstarter. Here are some common scenarios:

  1. **Account and Technical Issues:**
    - Help users with account creation, login issues, and password resets.
    - Provide guidance on troubleshooting technical problems related to the platform.

  2. **Platform Navigation and Features:**
    - Explain how to schedule and start an AI interview session.
    - Guide users on using different features, such as reviewing feedback, accessing resources, and tracking progress.

  3. **Interview Preparation:**
    - Offer tips on how to prepare for technical interviews.
    - Suggest resources or specific topics for users to focus on based on their practice needs.

  4. **Subscription and Billing:**
    - Assist with subscription plans, billing inquiries, and payment issues.
    - Provide information on trial periods and promotions.

  5. **Feedback and Improvement:**
    - Collect user feedback to help improve the platform.
    - Encourage users to share their experiences and suggestions.

  Your goal is to assist users with accurate, clear, and friendly responses. Use Markdown or HTML tags for bold text and other formatting.
`;


export async function POST(req: Request) {
  try {
    // Initialize GoogleGenerativeAI with API Key
    //@ts-ignore
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const { prompt } = await req.json() as { prompt: string };

    // Combine system prompt with user input
    const combinedPrompt = `${systemPrompt}\nUser: ${prompt}\nAI:`;

    // Generate content using the AI model
    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;
    const text = await response.text();

    console.log(text);
    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error occurred', error: error.message }, { status: 500 });
  }
}
