'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { buildRunPath, makeLengthLookup } from '@/lib/runPath';

// Línea que recorre la página interna y se dibuja con el scroll.
// Se monta dentro de <main class="inner-page">.
const LOOK_AHEAD = 0.7; // la punta de la línea sigue a este % del alto de la pantalla
const INTRO_SPEED = 650; // px por segundo al dibujar la entrada del hero

// shape: entrada del hero (HERO_SHAPES en lib/runPath)
export default function RunLine({ color = 'azul', shape = 'rulo' }) {
    const layerRef = useRef(null);

    useEffect(() => {
        const layer = layerRef.current;
        const main = layer.parentElement;
        const svg = layer.querySelector('svg');
        const path = svg.querySelector('path');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const state = { len: 0 };
        let total = 0;
        let lookup = () => 0;
        let heroLen = 0; // el hero queda siempre dibujado completo
        let ready = false;

        const render = () => { path.style.strokeDashoffset = total - state.len; };

        const targetLen = () => Math.max(heroLen, lookup(target()));
        const target = () => window.scrollY + window.innerHeight * LOOK_AHEAD - (main.getBoundingClientRect().top + window.scrollY);

        const build = () => {
            const W = main.clientWidth;
            const H = main.scrollHeight;
            const sections = [...main.children].filter((el) => el !== layer && el.offsetHeight > 40);
            if (!sections.length) return;
            const cuts = sections.slice(1).map((el) => el.offsetTop);
            const endY = H; // la línea sigue de largo por debajo del borde (lo recorta overflow: clip)
            svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
            svg.setAttribute('width', W);
            svg.setAttribute('height', H);
            // Dónde termina el texto del hero (líneas reales de título y bajada) + aire: la línea va a su derecha
            const mainLeft = main.getBoundingClientRect().left;
            const textRange = document.createRange();
            const heroTextRight = Math.max(0, ...[...sections[0].querySelectorAll('.inner-hero__title, .inner-hero__lead')].flatMap((el) => {
                textRange.selectNodeContents(el);
                return [...textRange.getClientRects()].map((r) => r.right - mainLeft);
            }));
            const mobile = W < 768;
            // Desktop: la entrada va a la derecha del texto. Celular: el texto ocupa todo el ancho, así que
            // la entrada usa solo la franja vacía de arriba (hasta la volanta) y sale por el costado antes del texto.
            const safeX = mobile ? 0 : heroTextRight + 90;
            const eyebrow = sections[0].querySelector('.inner-eyebrow');
            const heroBand = mobile && eyebrow ? eyebrow.getBoundingClientRect().top - main.getBoundingClientRect().top - 24 : sections[0].offsetHeight;
            path.setAttribute('d', buildRunPath({ W, heroH: heroBand, cuts, endY, shape, safeX, compact: mobile }));
            total = path.getTotalLength();
            const samples = [];
            for (let len = 0; len <= total; len += 6) {
                const p = path.getPointAtLength(len);
                samples.push({ len, x: p.x, y: p.y });
            }
            lookup = makeLengthLookup(samples);
            path.style.strokeDasharray = total;
            // Oculta lo que todavía no se dibujó (si no, la línea se ve entera hasta que arranca la entrada)
            path.style.strokeDashoffset = total - state.len;

            // el hero queda dibujado completo desde el principio
            const heroH = sections[0].offsetHeight;
            heroLen = (samples.find((pt) => pt.y > heroH) || samples[samples.length - 1]).len;
            if (reduce) { path.style.strokeDashoffset = 0; return; }
            if (ready) { state.len = targetLen(); render(); }
        };

        const onScroll = () => {
            if (!ready) return;
            gsap.to(state, { len: targetLen(), duration: 0.45, ease: 'power2.out', overwrite: true, onUpdate: render });
        };

        build();
        if (!reduce) {
            // Entrada: dibuja desde el inicio hasta donde corresponde, a ritmo constante (no en un tiempo
            // fijo: una línea larga iría apurada). Arranca cuando ya entró el título del hero.
            const introLen = targetLen();
            gsap.to(state, {
                len: introLen,
                duration: gsap.utils.clamp(2.4, 4.5, introLen / INTRO_SPEED),
                delay: 0.9,
                ease: 'sine.inOut',
                onUpdate: render,
                onComplete: () => { ready = true; },
            });
            window.addEventListener('scroll', onScroll, { passive: true });
        }
        const ro = new ResizeObserver(() => build());
        ro.observe(main);

        return () => {
            ro.disconnect();
            window.removeEventListener('scroll', onScroll);
            gsap.killTweensOf(state);
        };
    }, []);

    return (
        <div ref={layerRef} className={`run-line run-line--${color}`} aria-hidden="true">
            <svg fill="none"><path /></svg>
        </div>
    );
}
