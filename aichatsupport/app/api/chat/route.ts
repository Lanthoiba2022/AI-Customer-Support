import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const systemPrompt = `
You are a dedicated customer support assistant EXCLUSIVELY for Headstarter, an AI interview practice platform. You must ONLY respond to questions related to Headstarter and its services.

IMPORTANT RESTRICTIONS:
- You MUST NOT answer questions about programming, coding problems, algorithms, data structures, or technical concepts
- You MUST NOT write poems, stories, or any creative content
- You MUST NOT provide general knowledge answers
- You MUST NOT help with homework, assignments, or educational content unrelated to Headstarter
- You MUST NOT answer questions about other companies, platforms, or services

ONLY respond to questions about:
1. **Headstarter Account Management:**
   - Account creation, login issues, password resets
   - Profile setup and management
   - Account deletion or deactivation

2. **Platform Features and Navigation:**
   - How to schedule and start AI interview sessions
   - Using the feedback system and reviewing performance
   - Accessing learning resources and materials
   - Progress tracking and analytics
   - Platform tutorials and guides

3. **Interview Preparation (Headstarter-specific):**
   - How to use Headstarter's AI interview system
   - Understanding Headstarter's feedback mechanisms
   - Best practices for using the platform effectively
   - Available interview types and formats on Headstarter

4. **Subscription and Billing:**
   - Subscription plans and pricing
   - Payment methods and billing issues
   - Trial periods and promotional offers
   - Cancellation and refund policies

5. **Technical Support:**
   - Platform bugs and technical issues
   - Browser compatibility and system requirements
   - Audio/video issues during interviews
   - Connection problems

6. **General Platform Information:**
   - What Headstarter offers and how it works
   - Company policies and terms of service
   - Contact information and support hours

If a user asks about anything NOT related to Headstarter's services, respond with:
"I'm specifically designed to help with Headstarter-related questions only. I can assist you with account issues, platform features, interview preparation using our platform, billing questions, or technical support. Is there anything about Headstarter I can help you with?"

Always be helpful, professional, and friendly when addressing Headstarter-related queries.
`;

const headstarterKeywords = [
  'headstarter', 'account', 'login', 'password', 'reset', 'interview', 'ai interview',
  'feedback', 'subscription', 'billing', 'payment', 'trial', 'platform', 'schedule',
  'technical issue', 'bug', 'audio', 'video', 'connection', 'profile', 'progress',
  'analytics', 'tutorial', 'guide', 'refund', 'cancel', 'pricing', 'plan'
];

const offTopicKeywords = [
  'algorithm', 'data structure', 'coding', 'programming', 'python', 'javascript',
  'java', 'c++', 'leetcode', 'poem', 'story', 'essay', 'homework', 'assignment',
  'math', 'physics', 'chemistry', 'history', 'recipe', 'weather', 'news'
];

function isHeadstarterRelated(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  
  const hasHeadstarterKeywords = headstarterKeywords.some(keyword => 
    lowerPrompt.includes(keyword.toLowerCase())
  );
  
  const hasOffTopicKeywords = offTopicKeywords.some(keyword => 
    lowerPrompt.includes(keyword.toLowerCase())
  );
  
  if (hasOffTopicKeywords && !hasHeadstarterKeywords) {
    return false;
  }
  
  if (hasHeadstarterKeywords) {
    return true;
  }
  
  // For ambiguous cases, let the AI decide with the strict system prompt
  return true; 
}

export async function POST(req: Request) {
  try {
    // Initialize GoogleGenerativeAI with API Key
    //@ts-ignore
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const { prompt } = await req.json() as { prompt: string };
    
    // Quick filtering for obviously off-topic queries
    if (!isHeadstarterRelated(prompt)) {
      return NextResponse.json({ 
        message: "I'm specifically designed to help with Headstarter-related questions only. I can assist you with account issues, platform features, interview preparation using our platform, billing questions, or technical support. Is there anything about Headstarter I can help you with?" 
      });
    }
    
    // Combine system prompt with user input
    const combinedPrompt = `${systemPrompt}\n\nUser Question: ${prompt}\n\nResponse:`;
    
    // Generate content using the AI model
    const result = await model.generateContent(combinedPrompt);
    const response = await result.response;
    const text = await response.text();
    
    // Additional check: if the response seems to be answering off-topic questions
    const lowerResponse = text.toLowerCase();
    const responseContainsCode = lowerResponse.includes('```') || 
                                lowerResponse.includes('def ') || 
                                lowerResponse.includes('function') ||
                                lowerResponse.includes('class ') ||
                                lowerResponse.includes('algorithm') ||
                                lowerResponse.includes('data structure');
    
    if (responseContainsCode && !lowerResponse.includes('headstarter')) {
      return NextResponse.json({ 
        message: "I'm specifically designed to help with Headstarter-related questions only. I can assist you with account issues, platform features, interview preparation using our platform, billing questions, or technical support. Is there anything about Headstarter I can help you with?" 
      });
    }
    
    console.log(text);
    return NextResponse.json({ message: text });
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      message: 'I apologize, but I encountered an error while processing your request. Please try again or contact Headstarter support directly.', 
      error: error.message 
    }, { status: 500 });
  }
}
