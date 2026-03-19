
export function AdminHeroSection() {
    return (
        <section className="relative w-full min-h-[calc(100svh-112px)] lg:min-h-[calc(100svh-148px)] bg-black ">
            {/* Background blur effect */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1165px] h-[662px] bg-blue-500/25 blur-[125px]" />
              </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100svh-112px)] lg:min-h-[calc(100svh-148px)]">
                <div className="-translate-y-[56px] lg:-translate-y-[74px] flex flex-col items-center text-center gap-2">
                    <div className="relative text-[90px] md:text-[150px] font-semibold uppercase leading-tight inline-block text-center">
                            {/* Multiple text layers for glow effect */}
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF]">
                                ADMIN PAGE
                            </div>
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57)]">
                                ADMIN PAGE
                            </div>
                            <div className="relative text-white">
                                ADMIN PAGE
                            </div>
                        </div>


                    <div className="relative">
                        <div className="relative text-[30px] md:text-[50px] font-semibold uppercase leading-tight inline-block text-center">
                            {/* Multiple text layers for glow effect */}
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF,0_0_4px_#2769BF]">
                                Be careful<br />
                                when entering!
                            </div>
                            <div className="absolute inset-0 text-ieee-lightblue [text-shadow:0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57),0_0_8.5px_rgba(39,105,191,0.57)]">
                                Be careful<br />
                                when entering!
                            </div>
                            <div className="relative text-white">
                                Be careful<br />
                                when entering!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
