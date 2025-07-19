import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users, HandCoins, CreditCard, Shield } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <header className="w-full p-6">
                    <nav className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welfare System</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 transition ease-in-out duration-150"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition duration-150"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 transition ease-in-out duration-150"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Welcome to Our Welfare System
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Manage your contributions, apply for loans, and track your financial journey with our comprehensive welfare management platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                                <HandCoins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Easy Contributions
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Make and track your welfare contributions with ease. View your contribution history and plan ahead.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                                <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Quick Loans
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Apply for loans when you need them. Track repayments and manage your loan portfolio efficiently.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Community Support
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Be part of a supportive community working together for financial security and growth.
                            </p>
                        </div>
                    </div>

                    {!auth.user && (
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to get started?
                            </h3>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-blue-700 transition ease-in-out duration-150"
                                >
                                    Join Now
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition ease-in-out duration-150"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
                        <p>&copy; 2024 Welfare System. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
