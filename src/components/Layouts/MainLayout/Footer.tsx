import { Link } from "react-router-dom"
import linkedinIcon from '../../../assets/icons/linkedin_icon.svg';
import youtubeIcon from '../../../assets/icons/youtube_icon.svg';
import facebookIcon from '../../../assets/icons/facebook_icon.svg';
import instagramIcon from '../../../assets/icons/instagram_icon.svg';
import tiktokIcon from '../../../assets/icons/tiktok_icon.svg';
import telegramIcon from '../../../assets/icons/telegram_icon.svg';
import ieeeLogo from '../../../assets/icons/ieee_logo.svg';

export default function Component() {
    return (
        <footer className="bg-[#00629c] text-black px-8 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Related Section */}
                    <div>
                        <h3 className="text-black font-semibold mb-6 text-lg">RELATED</h3>
                        <div className="space-y-4">
                            <Link to="#" className="block text-black underline hover:no-underline hover:text-black transition-all">
                                IEEE Signal Processing Society
                            </Link>
                            <Link to="#" className="block text-black underline hover:no-underline transition-all">
                                ASP-LAB Website
                            </Link>
                            <Link to="#" className="block text-black underline hover:no-underline transition-all">
                                Nazarbayev University Website
                            </Link>
                        </div>
                    </div>

                    {/* Global Section */}
                    <div>
                        <h3 className="text-black font-semibold mb-6 text-lg">GLOBAL</h3>
                        <div className="space-y-4">
                            <Link to="#" className="block text-black underline hover:no-underline transition-all">
                                IEEE Official
                            </Link>
                            <Link to="#" className="block text-black underline hover:no-underline transition-all">
                                IEEE Xplore
                            </Link>
                            <Link to="#" className="block text-black underline hover:no-underline transition-all">
                                IEEE Membership
                            </Link>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-black font-semibold mb-6 text-lg">CONTACT</h3>
                        <div className="space-y-4">
                            <Link
                                to="mailto:ieee@nu.edu.kz"
                                className="block text-black underline hover:no-underline transition-all"
                            >
                                ieee@nu.edu.kz
                            </Link>

                            {/* Social Media Icons */}
                            <div className="flex gap-3 mt-6">
                                <Link to="#" className="text-black hover:opacity-70 transition-opacity">
                                    <img src={linkedinIcon} alt={"LinkedIn Icon"} />
                                </Link>
                                <Link to="#" className="text-black hover:opacity-70 transition-opacity">
                                    <img src={youtubeIcon} alt={"YouTube Icon"} />
                                </Link>
                                <Link to="#" className="text-black hover:opacity-70 transition-opacity">
                                    <img src={facebookIcon} alt={"Facebook Icon"} />
                                </Link>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Link to="#" className="text-black hover:opacity-70 transition-opacity">
                                    <img src={instagramIcon} alt={"Instagram Icon"} />
                                </Link>
                                <Link to="#" className="text-black hover:opacity-70 transition-opacity">
                                    <img src={tiktokIcon} alt={"Tiktok Icon"} />
                                </Link>
                                <Link to="#" className="text-black hover:opacity-70 transition-opacity">
                                    <img src={telegramIcon} alt={"Telegram Icon"} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section with logo and copyright */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-8 border-t border-black/20">
                    {/* IEEE Logo */}
                    <img src={ieeeLogo} alt={"Ieee Logo"} />

                    {/* Copyright */}
                    <div className="text-right text-black">
                        <div className="font-semibold mb-1">© 2025 IEEE Student Branch</div>
                        <div className="text-sm">Nazarbayev University, 53 Kabanbay Batyr Avenue, Astana, Kazakhstan.</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
