import {MainLayout} from "../components/Layouts/MainLayout/MainLayout.tsx";
import {HeroSection}  from "../components/HomePage/HeroSection.tsx";
import {BigTextSection} from "../components/HomePage/BigTextSection.tsx";
import {AnnouncementTicker} from "../components/HomePage/AnnouncementTicker.tsx";
import {AboutUsSection} from "../components/HomePage/AboutUsSection.tsx";
import {EventsSection} from "../components/HomePage/EventsSection.tsx";

export default function HomePage() {
    return (
        <MainLayout>
            <main>
                <HeroSection />
                <BigTextSection />
                <AnnouncementTicker />
                <AboutUsSection />
                <EventsSection />
            </main>
        </MainLayout>
    );
}
