import type { JSX } from "react";

const navigationItems = [
    { label: "ABOUT US", href: "#about" },
    { label: "HACKATON 2.0", href: "#hackaton" },
    { label: "EVENTS", href: "#events" },
    { label: "BOARD MEMBERS", href: "#board" },
    { label: "CONTACT US", href: "#contact" },
];

export const Header = (): JSX.Element => {
    return (
        <header className="w-full bg-black shadow-md">
            <div className="flex items-center justify-between px-10 py-4 w-full">
                {/* Left Logo */}
                <img
                    className="w-[40px] h-auto"
                    src="https://c.animaapp.com/sCKbCvcE/img/logo-ph1.svg"
                    alt="IEEE Logo"
                />

                {/* Nav Items */}
                <nav className="flex gap-8">
                    {navigationItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-semibold text-sm tracking-wide"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right logo */}
                <img
                    className="w-[32px] h-auto"
                    src="https://c.animaapp.com/sCKbCvcE/img/logo-ph2.svg"
                    alt="Globe Icon"
                />
            </div>
        </header>
    );
};
