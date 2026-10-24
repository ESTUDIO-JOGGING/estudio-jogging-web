'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brands, colors } from '@/lib/data';

// ─── Mezcla al azar de logos y colores ───────────────────────────────────────
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function shuffleNoAdjacentSrc(array) {
    const arr = shuffleArray([...array]);
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].src === arr[i - 1].src) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j].src !== arr[i - 1].src) { [arr[i], arr[j]] = [arr[j], arr[i]]; break; }
            }
        }
    }
    if (arr[arr.length - 1].src === arr[0].src) {
        for (let j = 1; j < arr.length - 1; j++) {
            if (arr[j].src !== arr[0].src && arr[j].src !== arr[arr.length - 2].src) {
                [arr[arr.length - 1], arr[j]] = [arr[j], arr[arr.length - 1]]; break;
            }
        }
    }
    return arr;
}

function assignColorsNoAdjacent(count, colorPool) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const prev = i > 0 ? result[i - 1] : null;
        const seamColor = i === count - 1 ? result[0] : null;
        const available = colorPool.filter(c => c !== prev && c !== seamColor);
        const pool = available.length > 0 ? available : colorPool.filter(c => c !== prev);
        result.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return result;
}

function buildMarqueeItems() {
    const tracks = [[], []];
    for (let t = 0; t < 2; t++) {
        const shuffledBrands = shuffleNoAdjacentSrc(brands);
        const assignedColors = assignColorsNoAdjacent(shuffledBrands.length, colors);
        const items = shuffledBrands.map((brand, i) => ({ brand, color: assignedColors[i] }));
        tracks[t] = [...items, ...items]; // duplicado para que el loop no se corte
    }
    return tracks;
}

// [número de nube comic, ancho en px]: de izquierda a derecha, superpuestas
const MARQUEE_CLOUDS = [[1, 70], [2, 85], [4, 130], [3, 95], [1, 65]];

export default function BrandsMarquee() {
    const [tracks, setTracks] = useState([[], []]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        setTracks(buildMarqueeItems());

        // la flecha hacia los logos se dibuja al entrar en pantalla
        gsap.set('.marquee-arrow path', { strokeDashoffset: 1000 });

        const marqueeTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.brands-marquee',
                start: 'top 70%',
                toggleActions: 'play none none reverse' // se repite si se vuelve a pasar
            }
        });

        marqueeTl
            .from('.marquee-clouds img', { scale: 0, y: 20, duration: 0.6, ease: 'back.out(2)', stagger: 0.07 })
            .to('.marquee-arrow path', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, '-=0.3');

        return () => {
            ScrollTrigger.getAll().forEach(t => { if (t.vars.trigger === '.brands-marquee') t.kill(); });
        };
    }, []);

    return (
        <>
            {/* Izquierda: título, nubes y flecha */}
            <div className="marquee-left">
                <div className="marquee-text-container">
                    <h2>Orgullosos de<br /><span className="text-with">trabajar con:</span></h2>
                    {/* Nubes chiquitas que "sostienen" la frase */}
                    <div className="marquee-clouds" aria-hidden="true">
                        {MARQUEE_CLOUDS.map(([n, w], i) => (
                            <img key={i} src={`/assets/Nubes/${n}nube-comic.svg`} alt="" style={{ width: w }} />
                        ))}
                    </div>
                </div>
                <div className="marquee-blob-container">
                    <div className="marquee-svg-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none" className="marquee-arrow" aria-hidden="true">
                            <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Derecha: dos columnas de logos que suben y bajan */}
            <div className="marquee-right">
                {tracks.map((trackItems, colIndex) => (
                    <div key={colIndex} className="marquee-column">
                        <div className="marquee-track">
                            {trackItems.map((item, i) => (
                                <div key={i} className="marquee-item" data-brand={item.brand.name} style={{ backgroundColor: item.color }}>
                                    <div className="marquee-logo">
                                        <img src={item.brand.src} loading="lazy" alt={item.brand.name} className="cover-image" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
