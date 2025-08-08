import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
            <Head>
                <title>About - AI Village</title>
                <meta name="description" content="The story behind AI Village" />
                <link rel="icon" href="/images/logo.png" />
            </Head>

            {/* Consistent Header */}
            <header className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Image
                            src="/images/logo.png"
                            alt="AI Village Logo"
                            className="rounded-full mr-3 object-contain border-2 border-white/30"
                            width={40}
                            height={40}
                        />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">AI Village</h1>
                            <p className="text-sm text-white/80 -mt-1 font-medium">Offline Education for All</p>
                        </div>
                    </div>
                    <nav>
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                            Home
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Story Content */}
            <main className="flex-1 overflow-y-auto p-6 container mx-auto max-w-3xl">
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-600">
                    <div className="text-center mb-8">
                        <Image
                            src="/images/logo.png"
                            alt="AI Village Logo"
                            className="mx-auto rounded-full border-2 border-blue-100 dark:border-gray-600 object-contain"
                            width={80}
                            height={80}
                        />
                        <h1 className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">Why I Built AI Village</h1>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed mb-6">
                            I grew up where curiosity burned bright, but resources were scarce.
                        </p>

                        <p className="text-lg leading-relaxed mb-6">
                            There was no internet. No tutors. Only torn textbooks and questions we had no one to ask.
                        </p>

                        <p className="text-lg leading-relaxed mb-6">
                            Somehow, I got out. Call it grace or luck — but many of my friends didn&apos;t. Their spark faded.
                        </p>

                        <p className="text-lg leading-relaxed mb-6 font-semibold text-blue-600 dark:text-blue-400">
                            AI Village is my way of giving back.
                        </p>

                        <p className="text-lg leading-relaxed mb-6">
                            A tiny offline AI assistant — no servers, no subscriptions — just answers.
                        </p>

                        <p className="text-lg leading-relaxed mb-6">
                            Built for the next generation of curious kids who deserve more than waiting for connection.
                        </p>

                        <p className="text-lg leading-relaxed italic text-gray-600 dark:text-gray-300">
                            Because learning shouldn&apos;t depend on privilege.
                        </p>
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/">
                            <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium text-center cursor-pointer">
                                Back to Home
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
