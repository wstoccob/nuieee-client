import ieeeHeroSection from '../../assets/icons/IEEE_mainscreen.svg';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[calc(100svh-112px)] lg:min-h-[calc(100svh-148px)] bg-black ">
            {/* Background blur effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1165px] h-[662px] bg-blue-500/25 blur-[125px]" />
              </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100svh-112px)] lg:min-h-[calc(100svh-148px)]">
                <div className="-translate-y-[56px] lg:-translate-y-[74px] flex flex-col items-center text-center gap-2">
                    {/* The contents need to be lifted by 112/2=56 and lg:114/2=74 to place them at the center*/}
                    <img src={ieeeHeroSection} alt={'IEEE Hero Section'} className="block max-w-full h-auto m-0" />

                    {/* Student Branch Text */} 
                    <div className="relative">
                        <div className="relative text-[30px] md:text-[50px] font-semibold uppercase leading-tight inline-block text-center">
                            {/* Multiple text layers for glow effect */}
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF]">
                                Student Branch at<br />
                                Nazarbayev University
                            </div>
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57)]">
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
            </div>
        </section>
    );
}
