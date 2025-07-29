export const AboutUsSection = () => {
    return (
        <section className="bg-black text-white py-16 lg:py-24">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-[clamp(60px,8vw,100px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-8">
                    about us
                </h2>

                {/* Content */}
                <div className="max-w-7xl">
                    <p className="text-[clamp(18px,2.5vw,30px)] font-inter font-semibold leading-[1.2] text-white">
                        The NU IEEE Student Branch (NU IEEE SB) is a vibrant community of engineering students at
                        Nazarbayev University, dedicated to advancing knowledge in electrical, computer, and engineering
                        fields. As part of the global IEEE network, we aim to connect students with industry leaders and
                        provide opportunities for hands-on learning.
                    </p>

                    <br />

                    <p className="text-[clamp(18px,2.5vw,30px)] font-inter font-semibold leading-[1.2] text-white">
                        Through workshops, hackathons, field trips, and networking events, we help students apply their
                        academic knowledge to real-world challenges. Our goal is to foster innovation, leadership, and
                        collaboration, while preparing the next generation of engineers for successful careers.
                    </p>
                </div>
            </div>
        </section>
    );
};