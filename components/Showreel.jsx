'use client';
import { useEffect, useRef, useState } from 'react';

// Reel del estudio: arranca en silencio cuando entra en pantalla; clic para activar el sonido.
export default function Showreel() {
    const videoRef = useRef(null);
    const [sound, setSound] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) video.play().catch(() => { });
            else video.pause();
        }, { threshold: 0.25 });
        io.observe(video);
        return () => io.disconnect();
    }, []);

    const toggleSound = () => {
        const video = videoRef.current;
        video.muted = sound;
        if (!sound) {
            // ponytail: frena la música del hero para que no se pisen; no sincroniza su botón
            document.querySelectorAll('audio').forEach((a) => a.pause());
            video.play().catch(() => { });
        }
        setSound(!sound);
    };

    return (
        <section className="showreel-section" id="showreel-section">
            <video
                ref={videoRef}
                className="showreel__video"
                src="/media/showreel/reel-jogging.mp4"
                poster="/media/showreel/reel-jogging.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Reel de Estudio Jogging"
                onClick={toggleSound}
            />
            <button type="button" className="showreel__sound" onClick={toggleSound}>
                {sound ? 'Sonido off' : 'Sonido on'}
            </button>
        </section>
    );
}
