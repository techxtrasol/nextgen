import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Home" />
            <div className="flex min-h-screen items-center justify-center">
                <h1 className="text-3xl font-bold">Welcome Home!</h1>
            </div>
        </>
    );
}
