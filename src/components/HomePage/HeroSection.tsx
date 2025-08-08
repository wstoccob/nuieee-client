import ieeeHeroSection from '../../assets/icons/IEEE_mainscreen.svg';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-screen bg-black overflow-hidden">
            {/* Background blur effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[1165px] h-[662px] bg-blue-500/25 blur-[125px]"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">

                <img src={ieeeHeroSection} alt={'IEEE Hero Section'} />

                {/* Student Branch Text */}
                <div className="text-center mb-16">
                    <div className="text-[30px] md:text-[50px] font-semibold uppercase leading-tight">
                        {/* Multiple text layers for glow effect */}
                        <div className="absolute text-ieee-lightblue [text-shadow:0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF]">
                            Student Branch at<br />
                            Nazarbayev University
                        </div>
                        <div className="absolute text-ieee-lightblue [text-shadow:0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57)]">
                            Student Branch at<br />
                            Nazarbayev University
                        </div>
                        <div className="relative text-white">
                            Student Branch at<br />
                            Nazarbayev University
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
