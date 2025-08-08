import Head from 'next/head';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo.png" />
        <title>AI Village - Offline Study Assistant</title>
        <meta name="description" content="Offline AI assistant for rural students" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}