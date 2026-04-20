import React from 'react';
import { Link } from 'react-router-dom';
import ieeeSmallBlueIcon from '../../assets/icons/ieee_small_blue_icon.svg';
import type { EventHomePageDto } from '../../dtos/HomePage/EventHomePageDto.ts';

export const EventCard: React.FC<EventHomePageDto> = ({ title, date, location, link }) => {
    return (
        <div className="w-full max-w-[1430px] px-4 mb-4">
            <div className="w-full border border-white bg-black rounded-[10px] relative p-4 
                            flex flex-col md:flex-row md:items-center md:justify-between">
                
                {/* IEEE Icon */}
                <div className="mb-4 md:hidden flex justify-center">
                    <img src={ieeeSmallBlueIcon} alt="IEEE Small Blue Icon" className="w-12 h-12" />
                </div>

                {/* Event Details */}
                <div className="flex flex-col items-center md:items-start md:w-1/3 text-white font-inter uppercase space-y-2">
                    <div className="text-xl md:text-2xl lg:text-[28px] font-semibold text-center md:text-left break-words w-full">
                        {title}
                    </div>
                    <div className="text-lg md:text-xl lg:text-[20px] font-semibold text-center md:text-left">
                        {date}
                    </div>
                    {location && (
                        <div className="text-lg md:text-xl lg:text-[20px] font-semibold text-center md:text-left">
                            {location}
                        </div>
                    )}
                </div>

                {/* Desktop Icon */}
                <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <img src={ieeeSmallBlueIcon} alt="IEEE Small Blue Icon" className="w-14 h-14"/>
                </div>

                {/* Explore More Link */}
                <div className="mt-4 md:mt-0 md:w-1/4 text-center md:text-right">
                    <Link
                        to={link}
                        className="inline-block text-ieee-blue font-inter text-base md:text-lg lg:text-[25px] font-semibold underline uppercase hover:text-ieee-light-blue transition-colors"
                    >
                        explore more
                    </Link>
                </div>
            </div>
        </div>
    );
};