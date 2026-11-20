'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

// Hero "mesa desordenada": objetos alrededor del título; los botones los reacomodan con Flip.
// Basado en la demo Creative Clutter (Codegrid): mismos objetos, tamaños (px) y posiciones (% de la mesa).
const SIZES = {
    music: 325, appicon: 100, cd: 400, cursor: 125, dialog: 300, folder: 150,
    lighter: 225, macmini: 250, paper: 375, passport: 250, portrait: 375,
};

// header: posición del texto (center: el punto es su centro); items: [x %, y %, rotación]
const MODOS = {
    caos: {
        header: { x: 50, y: 47.5, center: true },
        items: {
            music: [-2.5, -2.5, -15], appicon: [20, 15, 5], cd: [72.5, 5, 0], cursor: [72.5, 75, 0],
            dialog: [80, 60, 15], folder: [90, 50, 5], lighter: [2.5, 45, -10], macmini: [9.5, 55, 15],
            paper: [5, 15, 10], passport: [-2.5, 65, -35], portrait: [65, 20, -5],
        },
    },
    orden: {
        header: { x: 70, y: 27, center: false }, // más arriba que la demo: nuestro texto es más alto
        items: {
            music: [76.5, -5, 0], appicon: [64.5, 6, 0], cd: [0, 47.5, 0], cursor: [63.5, 23, 0],
            dialog: [34.5, 59, 0], folder: [24.5, 33, 0], lighter: [-6, 3.5, 0], macmini: [82.5, 66, 0],
            paper: [9, -3.5, 0], passport: [60, 65.5, 0], portrait: [36.5, 5.5, 0],
        },
    },
    cuaderno: {
        header: { x: 50, y: 47.5, center: true },
        items: {
            music: [45, 0.5, 20], appicon: [65, 70, 25], cd: [27.5, 15, 10], cursor: [75, 35, 0],
            dialog: [30, 57.5, 10], folder: [25, 40, 10], lighter: [30, 7.5, 30], macmini: [50, 50, -5],
            paper: [10, 10, -30], passport: [16.5, 50, -20], portrait: [57.5, 20, 10],
        },
    },
};

export default function ClutterHero({ title, lead }) {
    const deskRef = useRef(null);
    const headRef = useRef(null);
    const modoRef = useRef('caos');
    const [modo, setModo] = useState('caos');

    const layout = (m) => {
        const desk = deskRef.current;
        const head = headRef.current;
        const w = desk.offsetWidth;
        const h = desk.offsetHeight;
        const { header, items } = MODOS[m];
        const mobile = w < 1000; // en pantallas chicas el texto queda siempre al centro
        const center = mobile || header.center;
        gsap.set(head, {
            // sin pasarse del borde derecho (en 'orden' el texto va a la derecha)
            x: Math.min(((mobile ? 50 : header.x) / 100) * w - (center ? head.offsetWidth / 2 : 0), w - head.offsetWidth - 32),
            y: ((mobile ? 47.5 : header.y) / 100) * h - (center ? head.offsetHeight / 2 : 0),
        });
        Object.entries(items).forEach(([id, [x, y, rotation]]) => {
            gsap.set(desk.querySelector(`[data-id="${id}"]`), { x: (x / 100) * w, y: (y / 100) * h, width: SIZES[id], height: SIZES[id], rotation });
        });
    };

    useEffect(() => {
        layout(modoRef.current);
        const onResize = () => layout(modoRef.current);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const cambiar = (m) => {
        if (m === modoRef.current) return;
        const state = Flip.getState([headRef.current, ...deskRef.current.querySelectorAll('.clutter__item')]);
        layout(m);
        Flip.from(state, { duration: 1.25, ease: 'power3.inOut', stagger: { amount: 0.1, from: 'center' }, absolute: true });
        modoRef.current = m;
        setModo(m);
    };

    return (
        <section className="clutter">
            <div className="clutter__desk" ref={deskRef}>
                <div className="clutter__head" ref={headRef}>
                    <span className="inner-eyebrow">Nosotros</span>
                    <h1 className="clutter__title">{title}</h1>
                    {lead && <p className="clutter__lead">{lead}</p>}
                </div>
                {Object.keys(SIZES).map((id) => (
                    <div key={id} data-id={id} className="clutter__item">
                        <img src={`/assets/clutter/${id}.webp`} alt="" aria-hidden="true" draggable="false" />
                    </div>
                ))}
            </div>
            <div className="clutter__modos">
                {Object.keys(MODOS).map((m) => (
                    <button key={m} type="button" className={m === modo ? 'is-active' : ''} onClick={() => cambiar(m)}>{m}</button>
                ))}
            </div>
        </section>
    );
}
