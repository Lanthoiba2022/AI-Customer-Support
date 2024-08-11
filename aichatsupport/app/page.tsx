'use client'
import type { NextPage } from "next";
import Head from "next/head";
import Chat from "./components/Chat";


const Home: NextPage = () => {
  return (
    // <div>
    //   <Head>
    //     <title>AI Customer Support</title>
    //     <meta name="description" content="AI Customer Support Chat Interface" />
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>
    //   <main>
    //     <Chat />
    //   </main>
    // </div>
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-800 to-black text-white flex items-center justify-center">
      <Head>
        <title>Welcome to Botix</title>
        <meta name="description" content="Botix - AI Customer Support Chatbot leveraging Gemini API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center text-center text-zinc-300 p-5">
        <div><img src="https://cdn3d.iconscout.com/3d/premium/thumb/chatbot-8113743-6497271.png?f=webp" height={150} width={150} /></div>
        <h1 className="text-4xl sm:text-6xl font-bold mb-5">
          Welcome to <span className="text-blue-400">Botix</span>
        </h1>
        <p className="text-md sm:text-md max-w-2xl mx-auto mb-5">
          Botix is an AI-powered customer support chatbot, designed to enhance your customer service experience by leveraging the cutting-edge Gemini API. Whether you need help with a query or are looking for guidance, Botix is here to assist you 24/7.
        </p>
        <a
          href="/chat"
          className="mt-8 inline-block  hover:bg-gray-500 border border-solid border-zinc-400 text-white py-2 px-6 rounded-full text-lg transition duration-200"
        >
          Start Chatting
        </a>
      </main>
    </div>
  );
};

export default Home;