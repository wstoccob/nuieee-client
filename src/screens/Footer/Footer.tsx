import type {JSX} from "react";

export const Footer = (): JSX.Element => {
    return (
        <footer className="bg-black text-white text-sm py-4">
            <div className="w-full mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-center md:text-left">
                    © {new Date().getFullYear()} NU IEEE Student Branch. All rights reserved.
                </p>
                <div className="flex space-x-4">
                    <a
                        href="https://www.instagram.com/nuieee/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://t.me/nuieee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        Telegram
                    </a>
                </div>
            </div>
        </footer>
    );
};
