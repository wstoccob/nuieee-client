import React from 'react';
import { Link } from 'react-router-dom';
import ieeeSmallBlueIcon from '../../assets/icons/ieee_small_blue_icon.svg';
import type { EventHomePageDto } from '../../dtos/HomePage/EventHomePageDto.ts';

export const EventCard: React.FC<EventHomePageDto> = ({ title, date, location, link }) => {
    return (
        <div className="w-full max-w-[1430px] h-[200px] flex-shrink-0 mb-6 px-4">
            <div className="w-full h-full border border-white bg-black rounded-[10px] relative p-4 md:p-8 flex items-center">
                {/* Left Column: Title, Date, Location */}
                <div className="flex flex-col justify-center items-center text-white font-inter uppercase space-y-1 md:space-y-2 w-1/2 md:w-1/3">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-[35px] font-semibold text-center">{title}</div>
                    <div className="text-base sm:text-lg md:text-xl lg:text-[25px] font-semibold text-center">{date}</div>
                    <div className="text-base sm:text-lg md:text-xl lg:text-[25px] font-semibold text-center">{location}</div>
                </div>

                {/* IEEE Icon - Centered absolutely */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-100">
                    <img src={ieeeSmallBlueIcon} alt="IEEE Small Blue Icon" />
                </div>

                {/* Explore More Link - Right side */}
                <div className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-1/2 md:w-1/4 text-right">
                    <Link
                        to={link}
                        className="text-ieee-blue font-inter text-sm sm:text-base md:text-lg lg:text-[25px] font-semibold underline uppercase hover:text-ieee-light-blue transition-colors"
                    >
                        explore more
                    </Link>
                </div>
            </div>
        </div>
    );
};
