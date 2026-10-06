import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "../components/Layouts/MainLayout/MainLayout.tsx";
import { HeroSection } from "../components/HomePage/HeroSection.tsx";
import { AboutUsSection } from "../components/HomePage/AboutUsSection.tsx";
import { EventsSection } from "../components/HomePage/EventsSection.tsx";
import BoardMembersSection from "../components/HomePage/BoardMembersSection.tsx";

export default function HomePage() {
  const { hash, key } = useLocation();

  // The router does not scroll to #anchors, so links like /#about need this.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash, key]);

  return (
    <MainLayout>
      <div className="hk-root mx-auto w-full max-w-6xl">
        <HeroSection />
        <AboutUsSection />
        <EventsSection />
        <BoardMembersSection />
      </div>
    </MainLayout>
  );
}
