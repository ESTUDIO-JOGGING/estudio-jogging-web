'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        if (!window.__firma) { window.__firma = true; console.log('%cDiseño y desarrollo: florentin.studio', 'color: #fd6e9a; font-weight: bold;'); }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
            anchors: true, // los links #ancla (ej. #contacto) scrollean con Lenis en vez de quedar bloqueados
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        // queda en window para que otros componentes lo usen (window.__lenis)
        window.__lenis = lenis;

        return () => {
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    return null;
}
