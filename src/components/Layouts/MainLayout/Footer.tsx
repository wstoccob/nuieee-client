import { Link } from "react-router-dom"
import linkedinIcon from '../../../assets/icons/white logos/linkedin-white.png';
import youtubeIcon from '../../../assets/icons/white logos/youtube-white.png';
import instagramIcon from '../../../assets/icons/white logos/instagram-white.png';
import tiktokIcon from '../../../assets/icons/white logos/tiktok-white.png';
import telegramIcon from '../../../assets/icons//white logos/telegram-white.png';
import ieeeLogo from '../../../assets/icons/ieee_logo.svg';

export default function Component() {
    return (
        <footer className="bg-[#00629B] text-black px-8 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
                    <div>
                        <h3 className="text-gray-300 font-semibold mb-6 text-lg">RELATED</h3>
                        <div className="space-y-4">
                            <Link to="https://signalprocessingsociety.org/" className="block text-gray-300 underline hover:no-underline hover:text-black transition-all">
                                IEEE Signal Processing Society
                            </Link>
                            <Link to="https://sites.google.com/nu.edu.kz/asp-lab" className="block text-gray-300 underline hover:no-underline transition-all">
                                ASP-LAB Website
                            </Link>
                            <Link to="https://nu.edu.kz/" className="block text-gray-300 underline hover:no-underline transition-all">
                                Nazarbayev University Website
                            </Link>
                        </div>
                    </div>

                    {/* Global Section */}
                    <div>
                        <h3 className="text-gray-300 font-semibold mb-6 text-lg">GLOBAL</h3>
                        <div className="space-y-4">
                            <Link to="https://www.ieee.org/" className="block text-gray-300 underline hover:no-underline transition-all">
                                IEEE Official
                            </Link>
                            <Link to="https://ieeexplore.ieee.org/Xplore/home.jsp" className="block text-gray-300 underline hover:no-underline transition-all">
                                IEEE Xplore
                            </Link>
                            <Link to="https://www.ieee.org/membership" className="block text-gray-300 underline hover:no-underline transition-all">
                                IEEE Membership
                            </Link>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-gray-300 font-semibold mb-6 text-lg">CONTACT</h3>
                        <div className="space-y-4">
                            <Link
                                to="mailto:ieee@nu.edu.kz"
                                className="block text-gray-300 underline hover:no-underline transition-all"
                            >
                                ieee@nu.edu.kz
                            </Link>

                            {/* Social Media Icons */}
                            <div className="flex justify-center gap-3 mt-6">
                                <Link to="https://www.linkedin.com/company/ieeenu/" className="text-gray-300 hover:opacity-70 transition-opacity">
                                    <img src={linkedinIcon} alt={"LinkedIn Icon"} />
                                </Link>
                                <Link to="https://youtube.com/@nu_ieee" className="text-gray-300 hover:opacity-70 transition-opacity">
                                    <img src={youtubeIcon} alt={"YouTube Icon"} />
                                </Link>
                                <Link to="https://www.instagram.com/nuieee_sb" className="text-gray-300 hover:opacity-70 transition-opacity">
                                    <img src={instagramIcon} alt={"Instagram Icon"} />
                                </Link>
                                <Link to="https://www.tiktok.com/@nu_ieee" className="text-gray-300 hover:opacity-70 transition-opacity">
                                    <img src={tiktokIcon} alt={"Tiktok Icon"} />
                                </Link>
                                <Link to="https://t.me/nu_ieee" className="text-gray-300 hover:opacity-70 transition-opacity">
                                    <img src={telegramIcon} alt={"Telegram Icon"} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-end pt-8 border-t border-black/20 text-center md:text-right">
                    {/* IEEE Logo */}
                    <img src={ieeeLogo} alt={"Ieee Logo"} className="mb-4 md:mb-0" />

                    {/* Copyright */}
                    <div className="text-black">
                        <div className="font-semibold mb-1">© 2025 IEEE Student Branch</div>
                        <div className="text-sm">Nazarbayev University, 53 Kabanbay Batyr Avenue, Astana, Kazakhstan.</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
