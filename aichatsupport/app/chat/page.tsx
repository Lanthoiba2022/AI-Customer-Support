'use client'

import Head from "next/head";
import Chat from "../components/Chat";

export default function ChatPage() {
  return (
    <div>
      <Head>
        <title>AI Chat Support</title>
        <meta name="description" content="AI Customer Support Chat Interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Chat />
      </main>
    </div>
  );
}
