import { Link } from 'react-router-dom';
import ieeeIcon from '../../../assets/ieee_icon.svg';
import webIcon from '../../../assets/web_icon.svg';

const navLinks = [
    { label: 'HACKATHON 2.0', to: '/hackathon' },
    { label: 'ABOUT US', to: '/about' },
    { label: 'EVENTS', to: '/events' },
    { label: 'BOARD MEMBERS', to: '/board' },
    { label: 'CONTACT US', to: '/contact' },
];

const Header = () => {
    return (
        <header className="w-full bg-black flex justify-center">
            <div className="hidden lg:flex w-full max-w-[1440px] h-[100px] px-4 xl:px-[126px] items-center">
                <nav className="flex w-full items-center gap-2.5">
                    {/* Logo */}
                    <Link to="/" className="mr-auto">
                        <img src={ieeeIcon} alt="IEEE Icon" />
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center">
                        {navLinks.map(({ label, to }) => (
                            <Link
                                key={to}
                                to={to}
                                className="px-3 md:px-5 py-3 md:py-4 rounded-md hover:bg-gray-800 transition-colors"
                            >
                <span className="text-white text-sm md:text-lg lg:text-[22px] font-bold font-inter whitespace-nowrap">
                  {label}
                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Globe Icon */}
                    <div className="ml-auto">
                        <img src={webIcon} alt="Web Icon" className="w-[142px] h-[54.63px] px-8 py-1" />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
