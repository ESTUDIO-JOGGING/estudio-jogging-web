'use client';

import Navbar from '@/components/Navbar';
import HomeHero from '@/components/HomeHero';
import ServiceList from '@/components/ServiceList';
import InnerFx from '@/components/InnerFx';
import MotionCards from '@/components/MotionCards';
import Showreel from '@/components/Showreel';
import BrandsMarquee from '@/components/BrandsMarquee';
import Footer from '@/components/Footer';
import TransitionScribble from '@/components/TransitionScribble';
import CursorBubble from '@/components/CursorBubble';
import SmoothScroll from '@/components/SmoothScroll';

import HorizontalWords from '@/components/HorizontalWords';
import ReelsSection from '@/components/ReelsSection';

export default function Home() {
    return (
        <>
            <SmoothScroll />
            <CursorBubble />
            <InnerFx />
            <header className="main-header">
                <Navbar />
                <HomeHero />
            </header>
            <HorizontalWords />
            <main>
                <Showreel />
                <div className="content-section motion-cards-wrapper">
                    <MotionCards />
                </div>
                <div className="service-cards-wrapper home-alt">{/* el navbar usa service-cards-wrapper para cambiar de color */}
                    <ServiceList />
                </div>
            </main>
            <section className="brands-marquee">
                <BrandsMarquee />
            </section>
            <div className="home-alt">
                <ReelsSection title="Lo último que pusimos a correr." />
            </div>
            <footer className="main-footer">
                <Footer />
            </footer>
            <TransitionScribble />
        </>
    );
}
