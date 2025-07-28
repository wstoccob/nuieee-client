export const AnnouncementTicker = () => {
    return (
        <div className="bg-black text-white py-6 overflow-hidden">
            {/* Top ticker (left to right) */}
            <div className="relative w-full">
                <div className="flex animate-marquee whitespace-nowrap font-normal">
                    <span className="text-4xl font-inter font-extrabold tracking-tight lowercase mr-8">
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                    </span>
                </div>
            </div>

            {/* Bottom ticker (right to left) */}
            <div className="relative mt-4 w-full">
                <div className="flex animate-marquee-reverse whitespace-nowrap font-normal">
                    <span className="text-4xl font-inter font-extrabold tracking-tight lowercase mr-8">
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                        announcement announcement announcement announcement
                    </span>
                </div>
            </div>

            <style>
                {`
                @keyframes marquee {
                  0% { transform: translateX(0%); }
                  100% { transform: translateX(-50%); }
                }

                @keyframes marquee-reverse {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0%); }
                }

                .animate-marquee {
                  animation: marquee 20s linear infinite;
                }

                .animate-marquee-reverse {
                  animation: marquee-reverse 20s linear infinite;
                }
            `}
            </style>
        </div>
    );
};
