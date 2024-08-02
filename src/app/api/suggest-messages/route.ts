// import { NextResponse } from 'next/server';
// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';


// export const maxDuration = 30;

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await streamText({
//       model: openai('gpt-4-turbo'),
//       maxTokens: 400,
//       prompt,
//     });
//     return response.toDataStreamResponse();
//   } catch (error) {
        
//       console.error('An unexpected error occurred on suggesting message through the API:', error);
//       throw error;
   
//   }
// }
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const fallbackQuestions = [
  "What's a hobby you've recently started?",
  "If you could have dinner with any historical figure, who would it be?",
  "What's a simple thing that makes you happy?",
  "What's the best piece of advice you've ever received?",
  "If you could live in any fictional universe, where would you choose?",
  "What's a book or movie that has had a big impact on you?",
  "If you could instantly learn any skill, what would it be?",
  "What's a dream you've had that you still remember vividly?",
  "What's a food you could eat every day and never get tired of?",
  "If you could spend a day with any fictional character, who would it be?"
];

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 500,
      stream: true,
      prompt,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // OpenAI API error handling
      const { name, status, headers, message } = error;
      if (status === 402 || status ===429) { 
        // Fallback to predefined questions
        const fallbackResponse = fallbackQuestions.join('||');
        return NextResponse.json({ questions: fallbackResponse });
      }
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      throw error;
    }
  }
}

