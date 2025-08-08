import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from "../../../services/useAuth.ts";
import ieeeIcon from '../../../assets/icons/ieee_icon.svg';
import webIcon from '../../../assets/icons/web_icon.svg';

const adminNavLinks = [
    { label: 'Events', to: '/admin/events' },
    { label: 'News', to: '/admin/news' },
    { label: 'Hackathon', to: '/admin/hackathon' },
];

const AdminHeader = () => {
    const { user, logout} = useAuth();

    const navigate = useNavigate();
    const redirectToLoginPage = () => {
        navigate('../auth/login');
    }

    return (
        <header className="w-full bg-black flex justify-center">
            <div className="hidden lg:flex w-full max-w-[1440px] h-[100px] px-4 xl:px-[126px] items-center">
                <nav className="flex w-full items-center gap-2.5">
                    {/* Logo */}
                    <Link to="/admin" className="mr-auto">
                        <img src={ieeeIcon} alt="IEEE Icon" />
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center">
                        {adminNavLinks.map(({ label, to }) => (
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

                    {/* Login/Logout */}
                    <div className="ml-auto">
                        {user ? (
                            <button onClick={logout} className="text-black text-sm md:text-lg lg:text-[22px] font-bold font-inter  transition-colors">
                                Log out
                            </button>
                        ) : (
                            <button onClick={redirectToLoginPage} className="text-black text-sm md:text-lg lg:text-[22px] font-bold font-inter  transition-colors">
                                Log in
                            </button>
                        )}
                    </div>

                    {/* Globe Icon */}
                    <div>
                        <img src={webIcon} alt="Web Icon" className="w-[142px] h-[54.63px] px-8 py-1" />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default AdminHeader;
