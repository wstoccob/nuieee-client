import type { ReactNode } from "react";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

export const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Header/>
            <main className="flex-grow w-full max-w-full overflow-x-clip px-6 py-12 animate-page-in motion-reduce:animate-none">
                {children}
            </main>
            <Footer />
        </div>
    );
};
