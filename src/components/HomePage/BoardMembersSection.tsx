import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";

import aldiyarPhotoLink from '../../assets/images/aldiyar.jpg';
import altairPhotoLink from '../../assets/images/altair.jpg';
import amirPhotoLink from '../../assets/images/amir.jpg';
import aidanaPhotoLink from '../../assets/images/aidana.jpg';
import sabinaPhotoLink from '../../assets/images/sabina.jpg';
import arkenPhotoLink from '../../assets/images/arken.jpg';
import firuzaPhotoLink from '../../assets/images/firuza.jpg';
import mishaPhotoLink from '../../assets/images/misha.jpg';

interface BoardMember {
    name: string;
    role: string;
    image: string;
}

const boardMembers: BoardMember[] = [
    {
        name: "Amir Izimov",
        role: "president",
        image: amirPhotoLink,
    },
    {
        name: "Aldiyar Zhetkeyev",
        role: "hr head",
        image: aldiyarPhotoLink,
    },
    {
        name: "Altair Ibrayev",
        role: "treasurer",
        image: altairPhotoLink,
    },
    {
        name: "Aidana Alkenova",
        role: "vice-president",
        image: aidanaPhotoLink,
    },
    {
        name: "Sabina Sairangazyyeva",
        role: "secretary",
        image: sabinaPhotoLink,
    },
    {
        name: "Arken Gaisin",
        role: "web-development head",
        image: arkenPhotoLink,
    },
    {
        name: "Firuza Barayeva",
        role: "event head",
        image: firuzaPhotoLink,
    },
    {
        name: "Mikhail Yurikov",
        role: "pr head",
        image: mishaPhotoLink,
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
