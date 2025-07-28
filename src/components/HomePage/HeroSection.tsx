export const HeroSection = () => {
    return (
        <section className="relative min-h-[200px] h-auto bg-black text-white overflow-hidden mb-8">
            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20 h-[600px]">
                <div className="max-w-4xl">
                    {/* IEEE Logo/Title */}
                    <h1 className="text-[clamp(120px,15vw,200px)] font-inter font-extrabold leading-none tracking-tight mb-8">
                        IEEE
                    </h1>

                    {/* Student Branch Info */}
                    <div className="mb-8">
                        <h2 className="text-[clamp(32px,4vw,50px)] font-inter font-bold leading-tight tracking-tight mb-4">
                            Student Branch<br />
                            at Nazarbayev University
                        </h2>

                        {/* Divider line */}
                        <div className="w-full max-w-xl h-1 bg-white mb-4"></div>

                        <p className="text-[clamp(32px,4vw,50px)] font-inter font-bold tracking-tight">
                            est. 2017
                        </p>
                    </div>

                    {/* Note text */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-white/70 max-w-[157px] hidden lg:block">
                        <p>Development in progress</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
