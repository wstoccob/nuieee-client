import { MainLayout } from "../components/Layouts/MainLayout/MainLayout.tsx";
import {HeroSection}  from "../components/HomePage/HeroSection.tsx";
import { BigTextSection } from "../components/HomePage/BigTextSection.tsx";

export default function HomePage() {
    return (
        <MainLayout>
            <main>
                <HeroSection />
                <BigTextSection />
            </main>
        </MainLayout>
    );
}
