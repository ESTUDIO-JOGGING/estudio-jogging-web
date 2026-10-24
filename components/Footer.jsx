'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOCIAL_ICONS, WIGGLE_CONFIG, WHATSAPP_URL } from '@/lib/data';

function initWiggle(element, intensity) {
    const target = element.querySelector('[data-wiggle-target]') || element;
    gsap.set(target, { transformOrigin: 'center center' });
    let tween;
    const onEnter = () => { tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' }); };
    const onLeave = () => { if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); } };
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    return () => { element.removeEventListener('mouseenter', onEnter); element.removeEventListener('mouseleave', onLeave); };
}

export default function Footer() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // ─── Créditos: la caja crece al pasar el mouse ───
        const creditsWrapper = document.querySelector('.footer-credits-wrapper');
        if (creditsWrapper) {
            const creditsBox = creditsWrapper.querySelector('.credits-box');
            const creditsItems = creditsBox.querySelectorAll('.credits-item');

            // se muestra un instante para medirla
            gsap.set(creditsBox, { visibility: 'visible', width: 'auto', height: 'auto', opacity: 1 });
            // La caja se ajusta al texto: se mide el contenido (max-content) al abrir, no solo al montar,
            // porque al montar la tipografía de la marca puede no haber cargado todavía.
            const creditsContent = creditsBox.querySelector('.credits-content');
            const measure = () => {
                // box-sizing: border-box → sumar borde y padding de la caja (en mobile tiene padding propio)
                const cs = getComputedStyle(creditsBox);
                const px = (k) => parseFloat(cs[k]) || 0;
                return {
                    w: creditsContent.offsetWidth + px('borderLeftWidth') + px('borderRightWidth') + px('paddingLeft') + px('paddingRight'),
                    h: creditsContent.offsetHeight + px('borderTopWidth') + px('borderBottomWidth') + px('paddingTop') + px('paddingBottom'),
                };
            };
            const boxHeight = measure().h; // cuánto baja el texto al cerrarse

            // distancia desde donde termina la caja hasta detrás del botón
            const creditsBtn = creditsWrapper.querySelector('.footer-credits');
            const startY = creditsBtn.offsetHeight + 15;

            // estado inicial: caja cerrada (sin tamaño) y texto abajo
            gsap.set(creditsBox, { visibility: 'hidden', width: 0, height: 0, opacity: 0, y: startY });
            gsap.set(creditsItems, { y: boxHeight });

            const onEnter = () => {
                gsap.set(creditsBox, { visibility: 'visible' });
                gsap.killTweensOf(creditsBox);
                gsap.killTweensOf(creditsItems);

                // la caja crece hasta su tamaño (no escala)
                const { w, h } = measure();
                gsap.to(creditsBox, { width: w, height: h, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });

                // el texto sube, apenas después
                gsap.to(creditsItems, { y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.1 });
            };

            const onLeave = () => {
                gsap.killTweensOf(creditsBox);
                gsap.killTweensOf(creditsItems);

                // la caja se achica hasta desaparecer
                gsap.to(creditsBox, {
                    width: 0, height: 0, opacity: 0, y: startY, duration: 0.35, ease: 'power3.in',
                    onComplete: () => gsap.set(creditsBox, { visibility: 'hidden' })
                });

                // el texto baja en orden inverso (stagger negativo): primero sale la columna de la derecha
                gsap.to(creditsItems, { y: boxHeight, duration: 0.4, ease: 'power3.in', stagger: -0.03, delay: 0.1 });
            };

            creditsWrapper.addEventListener('mouseenter', onEnter);
            creditsWrapper.addEventListener('mouseleave', onLeave);
        }

        // ─── Elementos del footer que tiemblan al pasar el mouse ───
        const wiggleTargets = [
            { selector: '.footer-email', key: 'email' },
            { selector: '.footer-whatsapp', key: 'whatsapp' },
            { selector: '.credits-name', key: 'socials' }, // los nombres tiemblan como los íconos de redes
        ];
        wiggleTargets.forEach(({ selector, key }) => {
            document.querySelectorAll(selector).forEach(el => initWiggle(el, WIGGLE_CONFIG[key]));
        });

        // ─── Íconos de redes ───
        document.querySelectorAll('.single-social').forEach(el => initWiggle(el, WIGGLE_CONFIG.socials));

    }, []);

    return (
        <div className="footer-inner" id="contacto">
            <div className="footer-socials" id="footer-socials">
                {SOCIAL_ICONS.map(({ href, label, svg }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="single-social"
                        aria-label={label}
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                ))}
            </div>

            <div className="footer-top">
                {/* Contact */}
                <div className="footer-column">
                    <div className="footer-contact-group footer-contact-group--left">
                        <span className="footer-badge">contacto</span>
                        <a href="mailto:estudiojogging@gmail.com" className="footer-email">estudiojogging@gmail.com</a>
                    </div>
                    <div className="footer-contact-group footer-contact-group--right">
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-whatsapp">Envianos un Whatsapp</a>
                        <p className="footer-note">*Somos millennials y de la generación Z:{' '}<br className="footer-note__br" />por favor, no nos llamen.</p>
                    </div>
                </div>
            </div>

            {/* Logo grande "Estudio Creativo Jogging" */}
            <div className="footer-bottom">
                <div className="footer-big-text">
                    <img src="/logo/Logo%20footer%20Jogging.svg" alt="Jogging" className="footer-logo__svg" />
                </div>

                {/* créditos */}
                <div className="footer-bottom-row">
                    <div></div>
                    <div className="footer-credits-wrapper">
                        <div className="credits-box">
                            <div className="credits-content">
                                <div className="credits-item credit-wiggle">
                                    <div className="overflow-wrapper"><span className="credits-label">Diseño y desarrollo</span></div>
                                    <div className="overflow-wrapper"><a href="#" className="credits-name" data-wiggle-target="true">Florentin</a></div>
                                </div>
                                <div className="credits-item credit-wiggle">
                                    <div className="overflow-wrapper"><span className="credits-label">Ilustración</span></div>
                                    <div className="overflow-wrapper"><a href="#" className="credits-name" data-wiggle-target="true">Mica</a></div>
                                </div>
                            </div>
                        </div>
                        <a href="#" className="footer-credits">Creditos</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
