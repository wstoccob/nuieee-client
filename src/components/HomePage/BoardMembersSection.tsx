import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

interface BoardMember {
    name: string;
    role: string;
    image: string;
}

const boardMembers: BoardMember[] = [
    {
        name: "Bekzat Bekenuly",
        role: "President",
        image: "https://minio.ieee.nu/static/board-members/bekzat.jpg",
    },
    {
        name: "Miraiya Kospanova",
        role: "HR head",
        image: "https://minio.ieee.nu/static/board-members/miraiya.jpg",
    },
    {
        name: "Maxat Alpamyssov",
        role: "Treasurer",
        image: "https://minio.ieee.nu/static/board-members/maxat.jpg",
    },
    {
        name: "Dariga Suleimenova",
        role: "Vice-president",
        image: "https://minio.ieee.nu/static/board-members/dariga.jpg",
    },
    {
        name: "Yerassyl Shaimoldayev",
        role: "Secretary",
        image: "https://minio.ieee.nu/static/board-members/yerassyl.jpg",
    },
    {
        name: "Alinur Seisekov",
        role: "Web-development head",
        image: "https://minio.ieee.nu/static/board-members/alinur.jpg",
    },
    {
        name: "Ruana Bayakhmetova",
        role: "PR Head",
        image: "https://minio.ieee.nu/static/board-members/ruana.jpg",
    },
];

const BoardMembersSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        centerMode: true,
        centerPadding: "0px",
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
        useTransform: false,
        beforeChange: (_: number, next: number) => setCurrentSlide(next),
        customPaging: (i: number) => (
            <div
                className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                    i === currentSlide ? "bg-white" : "bg-gray-600"
                }`}
            />
        ),
        appendDots: (dots: never) => (
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

    return (
        <section className="bg-black text-white pt-36 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-[clamp(60px,8vw,96px)] font-inter font-extrabold text-ieee-blue lowercase leading-none mb-12">
                    board members
                </h2>
                <Slider {...settings}>
                    {boardMembers.map((member, idx) => (
                        <div key={idx} className="w-full px-2">
                            <div className="w-full aspect-[3/4] rounded-[20px] overflow-hidden mb-6 shadow-xl">
                                <img
                                    src={member.image}
                                    alt={member.name}
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
        </section>
    );
};

export default BoardMembersSection;
