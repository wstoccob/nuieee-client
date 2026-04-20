import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useRef } from "react";

interface BoardMember {
    name: string;
    role: string;
    image: string;
}

const boardMembers: BoardMember[] = [
    {
        name: "Bekzat Bekenuly",
        role: "President",
        image: "https://minio.ieee.nu/static/board-members/Bekzat_optimized_2000.jpg",
    },
    {
        name: "Miraiya Kospanova",
        role: "HR head",
        image: "https://minio.ieee.nu/static/board-members/Miraya_optimized_2000.jpg",
    },
    {
        name: "Maxat Alpamyssov",
        role: "Treasurer",
        image: "https://minio.ieee.nu/static/board-members/Maxat_3_optimized_2000.jpg",
    },
    {
        name: "Dariga Suleimenova",
        role: "Vice-president",
        image: "https://minio.ieee.nu/static/board-members/Dariga_optimized_2000.jpg",
    },
    {
        name: "Yerassyl Shaimoldayev",
        role: "Secretary",
        image: "https://minio.ieee.nu/static/board-members/Yerassyl_optimized_2000.jpg",
    },
    {
        name: "Alinur Seisekov",
        role: "Web-development head",
        image: "https://minio.ieee.nu/static/board-members/Alinur_optimized_2000.jpg",
    },
    {
        name: "Ruana Bayakhmetova",
        role: "PR Head",
        image: "https://minio.ieee.nu/static/board-members/Ruana_optimized_2000.jpg",
    },
    {
        name: "Madina Suleimenova",
        role: "Event Head",
        image: "https://minio.ieee.nu/static/board-members/Madina_optimized_2000.jpg",
    },
];

const BoardMembersSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        cssEase: "ease-in-out",
        centerMode: true,
        centerPadding: "0px",
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        useTransform: true,
        lazyLoad: "ondemand" as const,
        pauseOnHover: true,
        focusOnSelect: true,
        swipe: true,             // Enables touch swiping
        draggable: true,         // Enables desktop mouse dragging
        swipeToSlide: true,      // Allows users to drag/swipe smoothly to any slide
        touchThreshold: 10,      // Makes swiping slightly more responsive

        beforeChange: (_: number, next: number) => setCurrentSlide(next),
        customPaging: (i: number) => (
            <div
                className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                    i === currentSlide ? "bg-white" : "bg-gray-600"
                }`}
            />
        ),
        appendDots: (dots: any) => (
            <div className="flex justify-center mt-6">{dots}</div>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // Detect horizontal scrolling (trackpad or shift+mousewheel)
        if (e.deltaX > 0) {
            sliderRef.current?.slickNext();
        } else if (e.deltaX < 0) {
            sliderRef.current?.slickPrev();
        }
    };

    return (
        <section className="bg-black text-white pt-36 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-[clamp(60px,8vw,96px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-12">
                    board members
                </h2>
                {/* Wrapped the slider in a div to catch wheel events */}
                <div onWheel={handleWheel}>
                    <Slider ref={sliderRef} {...settings}>
                        {boardMembers.map((member, idx) => (
                            <div key={idx} className="w-full px-2 cursor-grab active:cursor-grabbing">
                                <div className="w-full aspect-[3/4] rounded-[20px] overflow-hidden mb-6 shadow-xl pointer-events-none">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover rounded-[20px]"
                                    />
                                </div>
                                <div className="text-center mb-8">
                                    <div className="text-ieee-blue font-inter text-[38px] font-normal mb-1">
                                        {member.role}
                                    </div>
                                    <div className="text-white font-inter text-[36px] font-bold">
                                        {member.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default BoardMembersSection;
