import ApplicationLogo from '@/Components/ApplicationLogo';
import BeaCukaiLogo from '@/Components/BeaCukaiLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <BeaCukaiLogo 
                        size="xlarge" 
                        padding={true}
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
