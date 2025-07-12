import type {ReactNode} from "react";
import { Header } from "../screens/Header/Header";
import { Footer } from "../screens/Footer/Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 w-full">
            <Header/>
            <main className="flex-grow w-full px-6 py-12">{children}</main>
            <Footer />
        </div>
    );
};