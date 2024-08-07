'use client'
import type { NextPage } from "next";
import Head from "next/head";
import Chat from "./components/Chat";


const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>AI Customer Support</title>
        <meta name="description" content="AI Customer Support Chat Interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Chat />
      </main>
    </div>
  );
};

export default Home;