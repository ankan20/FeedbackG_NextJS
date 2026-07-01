// // import { NextResponse } from 'next/server';
// // import { openai } from '@ai-sdk/openai';
// // import { streamText } from 'ai';


// // export const maxDuration = 30;

// // export async function POST(req: Request) {
// //   try {
// //     const prompt =
// //       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

// //     const response = await streamText({
// //       model: openai('gpt-4-turbo'),
// //       maxTokens: 400,
// //       prompt,
// //     });
// //     return response.toDataStreamResponse();
// //   } catch (error) {

// //       console.error('An unexpected error occurred on suggesting message through the API:', error);
// //       throw error;

// //   }
// // }
// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = 'edge';

// const fallbackQuestions = [
//   "What's a hobby you've recently started?",
//   "If you could have dinner with any historical figure, who would it be?",
//   "What's a simple thing that makes you happy?",
//   "What's the best piece of advice you've ever received?",
//   "If you could live in any fictional universe, where would you choose?",
//   "What's a book or movie that has had a big impact on you?",
//   "If you could instantly learn any skill, what would it be?",
//   "What's a dream you've had that you still remember vividly?",
//   "What's a food you could eat every day and never get tired of?",
//   "If you could spend a day with any fictional character, who would it be?"
// ];

// export async function GET(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     // const response = await openai.completions.create({
//     //   model: 'gpt-3.5-turbo-instruct',
//     //   max_tokens: 500,
//     //   stream: true,
//     //   prompt,
//     // });

//     // const stream = OpenAIStream(response);

//     // return new StreamingTextResponse(stream);
//     const newMessages = (fallbackQuestions :string[]):string[]=>{
//       let arr:string[]=[];
//       while(arr.length <3){
//         let index1=Math.floor(Math.random()*fallbackQuestions.length);
//         let index2=Math.floor(Math.random()*fallbackQuestions.length);
//         let index3=Math.floor(Math.random()*fallbackQuestions.length);
//         if(index1 !=index2 && index1 !=index3){
//           arr.push(fallbackQuestions[index1]);
//         }
//         if(index1 !=index2 && index2 !=index3){
//           arr.push(fallbackQuestions[index2]);
//         }
//         if(index3 !=index2 && index1 !=index3){
//           arr.push(fallbackQuestions[index3]);
//         }

//       }
//       return arr;
//     }

//     const fallbackResponse = newMessages(fallbackQuestions).join('||');
//     return Response.json({ questions: fallbackResponse })

//   } catch (error) {
//     // if (error instanceof OpenAI.APIError) {
//     //   // OpenAI API error handling
//     //   const { name, status, headers, message } = error;

//     //   return NextResponse.json({ name, status, headers, message }, { status });
//     // } else {
//     //   // General error handling
//     //   console.error('An unexpected error occurred:', error);
//     //   throw error;
//     // }
//     console.error("Error sending suggested messages ",error)
//     return Response.json({
//         success:false,
//         messages:"Internal server error"
//     },{
//         status:500
//     })
//   }
// }



import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const runtime = "edge";

const fallbackQuestions = [
  "If animals could talk, which one would roast humans the most?",
  "What’s the most useless superpower you can think of?",
  "If you woke up as a potato, how would you spend your day?",
  "Which fictional villain would make the best stand-up comedian?",
  "If you could swap lives with a cartoon character for a day, who would it be?",
  "What’s the weirdest food combo that actually slaps?",
  "If your life had background music, what song would play when you enter a room?",
  "Which inanimate object do you think is secretly judging you?"
];

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `
Create a list of exactly three **unique and never-before-repeated** open-ended questions.
Each question should be separated by '||'.
These are for an anonymous social messaging platform (like Qooh.me) and should be suitable for a diverse audience.
Avoid personal, political, or sensitive topics, but make them intriguing, fun, and conversation-starting.
Do NOT reuse or rephrase any example questions you've been given before.
Add a playful twist or unexpected angle so each set feels fresh.
Vary themes each time (could be about the future, silly hypotheticals, quirky "what if" scenarios, or imaginative challenges).
Format: "Question1||Question2||Question3".
Example for style only (do not copy): "If you woke up as a cloud, what would your first move be?||What’s a snack you’d take to a desert island?||If you had to teach aliens one game, what would it be?"
`;



    const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.9, 
    topP: 0.95,       
  }
});
    const text = result.response.text();
    console.log(text)

    return NextResponse.json({ questions: text });
  } catch (error) {
    console.error("Error generating questions:", error);

    const shuffled = fallbackQuestions.sort(() => 0.5 - Math.random());
    const randomThree = shuffled.slice(0, 3).join("||");

    return NextResponse.json({ questions: randomThree });
  }
}
