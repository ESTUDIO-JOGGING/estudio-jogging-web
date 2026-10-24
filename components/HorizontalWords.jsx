'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../app/styles/horizontal-words.css';

gsap.registerPlugin(ScrollTrigger);

const PHRASE = "A tiempos rápidos, movimientos suaves.";

const HorizontalWords = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = sectionRef.current;
            const textRef = container.querySelector('.horizontal-words__relative');
            const letters = container.querySelectorAll('.letter');

            const arrows = container.querySelectorAll('.horizontal-words__arrow-svg path, .horizontal-words__arrow-end-svg path');

            // La frase entra desde la derecha y se queda en pantalla (no sale del todo).
            // Se mide con su tamaño real, así funciona con cualquier largo de frase.
            const h2El = container.querySelector('.horizontal-words__h2');
            gsap.set(textRef, { x: 0, xPercent: 0 });
            // Medido en cada refresh (no una sola vez al cargar): si la fuente todavía no cargó,
            // la frase mide menos y el recorrido terminaba antes de mostrarla entera.
            const measure = () => {
                const x = gsap.getProperty(textRef, 'x');
                const r = h2El.getBoundingClientRect();
                return { left: r.left - x, right: r.right - x };
            };
            // al terminar, el final de la frase queda al 42% del ancho (ajustar ese número para correrla)
            const scrollTween = gsap.fromTo(textRef, {
                x: () => window.innerWidth - measure().left,         // arranca justo afuera, a la derecha
            }, {
                x: () => window.innerWidth * 0.42 - measure().right, // termina con la cola de la frase al 42%
                ease: 'none',
                invalidateOnRefresh: true,
                scrollTrigger: {
                    trigger: container,
                    start: "top top", // la sección queda fija al llegar arriba
                    end: "+=3000", // cuánto scroll dura el recorrido
                    scrub: 1,
                    pin: true
                }
            });

            // cada letra entra rebotando con un giro al azar
            letters.forEach((letter) => {
                gsap.from(letter, {
                    yPercent: (Math.random() - 0.5) * 500,
                    rotation: (Math.random() - 0.5) * 60,
                    ease: "elastic.out(1.2, 1)",
                    scrollTrigger: {
                        trigger: letter,
                        containerAnimation: scrollTween,
                        start: 'left 90%',
                        end: 'left 10%',
                        scrub: 0.5
                    }
                });
            });

            // Las flechas se dibujan a medida que pasa la frase
            arrows.forEach((arrowPath) => {
                if (arrowPath.getTotalLength) {
                    const pathLen = arrowPath.getTotalLength();
                    gsap.set(arrowPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
                    gsap.to(arrowPath, {
                        strokeDashoffset: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: arrowPath.parentElement, // arranca según la posición de la flecha
                            containerAnimation: scrollTween,
                            start: 'left 90%',
                            end: 'left 65%', // la flecha final queda a ~50% de la pantalla: con 30% nunca terminaba de dibujarse
                            scrub: 0.5
                        }
                    });
                }
            });

        }, sectionRef);

        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="horizontal-words-section content-section">
            <div className="horizontal-words__relative">
                <div className="horizontal-words__track">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none" className="horizontal-words__arrow-svg"><path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path><path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 140 127" fill="none" className="horizontal-words__arrow-end-svg"><path d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.437 125.078L99.6875 107.891" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path><path d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.438 125.078L137.969 110.234" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" ></path></svg>

                    <h2 className="display horizontal-words__h2" aria-label={PHRASE}>
                        {PHRASE.split("").map((char, i) =>
                            char === " " ? " " : (
                                <div key={i} className="letter" aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>{char}</div>
                            )
                        )}
                    </h2>
                </div>
            </div>

            <div className="horizontal-words__bottom-text">
                <div className="horizontal-words__bottom-text-l">
                    Somos un equipo creativo en movimiento que articula diseño, comunicación y tecnología 3D. Aportamos talento profesional a marcas que buscan coherencia, estética y ese "no sé qué" editorial.
                </div>
            </div>
        </section>
    );
};

export default HorizontalWords;
