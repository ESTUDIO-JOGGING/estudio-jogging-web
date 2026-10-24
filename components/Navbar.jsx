'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { WIGGLE_CONFIG, WHATSAPP_URL } from '@/lib/data';

function initWiggle(element, intensity) {
    const target = element.querySelector('[data-wiggle-target]') || element;
    gsap.set(target, { transformOrigin: 'center center' });
    let tween;
    const onEnter = () => {
        tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' });
    };
    const onLeave = () => {
        if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); }
    };
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    return () => {
        element.removeEventListener('mouseenter', onEnter);
        element.removeEventListener('mouseleave', onLeave);
    };
}

export default function Navbar() {
    useEffect(() => {
        const navbar = document.querySelector('.navbar');
        const contentSection = document.querySelector('.content-section');
        const footerEl = document.querySelector('.main-footer');
        const logoImg = document.querySelector('.logo-jogging');
        const HEADER_LOGO = '/logo/Logo%20Estudio%20Jogging.svg';
        const FOOTER_LOGO = '/logo/Iso%20footer.svg';

        // arranca en blanco: el hero es oscuro
        if (navbar) { navbar.classList.add('on-dark'); navbar.classList.remove('on-light'); }

        const updateNavbarColor = () => {
            if (!navbar || !footerEl) return;
            const scrollPos = window.scrollY + navbar.offsetHeight / 2;
            // Páginas internas no tienen .content-section: fondo claro desde arriba
            const contentTop = contentSection ? contentSection.getBoundingClientRect().top + window.scrollY : 0;

            const showreelSection = document.querySelector('#showreel-section');
            const showreelTop = showreelSection ? showreelSection.getBoundingClientRect().top + window.scrollY : Infinity;

            const serviceCardsSection = document.querySelector('.service-cards-wrapper');
            const serviceCardsTop = serviceCardsSection ? serviceCardsSection.getBoundingClientRect().top + window.scrollY : Infinity;

            const doubleMarquee = document.querySelector('.brands-marquee');
            const doubleMarqueeTop = doubleMarquee ? doubleMarquee.getBoundingClientRect().top + window.scrollY : Infinity;
            const footerTop = footerEl.getBoundingClientRect().top + window.scrollY;

            if (logoImg) {
                const targetLogo = scrollPos >= footerTop ? FOOTER_LOGO : HEADER_LOGO;
                if (logoImg.src.indexOf(targetLogo) === -1) logoImg.src = targetLogo;
            }

            // Bloques oscuros de páginas internas (hero azul, CTA) marcados con data-nav-dark
            const overDark = [...document.querySelectorAll('[data-nav-dark]')].some((el) => {
                const r = el.getBoundingClientRect();
                return r.top <= navbar.offsetHeight / 2 && r.bottom >= navbar.offsetHeight / 2;
            });

            if (scrollPos >= footerTop || overDark) {
                navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
            } else if (scrollPos >= doubleMarqueeTop) {
                navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
            } else if (scrollPos >= serviceCardsTop) {
                navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
            } else if (scrollPos >= showreelTop) {
                navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
            } else if (scrollPos >= contentTop) {
                navbar.classList.add('on-light'); navbar.classList.remove('on-dark');
            } else {
                navbar.classList.add('on-dark'); navbar.classList.remove('on-light');
            }
        };

        window.addEventListener('scroll', updateNavbarColor);
        updateNavbarColor();

        // el logo tiembla al pasar el mouse
        const cleanups = [];
        const logoJogging = document.querySelector('.logo-jogging');
        if (logoJogging) cleanups.push(initWiggle(logoJogging, WIGGLE_CONFIG.logoJogging));

        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            gsap.set(overlay, { opacity: 0, visibility: 'hidden' });
        }
        const showOverlay = () => {
            if (overlay) {
                gsap.set(overlay, { visibility: 'visible' });
                gsap.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' });
            }
        };
        const hideOverlay = () => {
            if (overlay) {
                gsap.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => gsap.set(overlay, { visibility: 'hidden' }) });
            }
        };

        // ─── Menú: se despliega desde la nube de MENÚ ───
        const navLeft = document.querySelector('.nav-left');
        const workBox = document.querySelector('.nav-menu-box');
        const workBlob = document.querySelector('.nav-bar__menu-blob-svg');

        if (navLeft && workBox && workBlob) {
            const workInner = workBox.querySelector('.nav-popout-inner');
            const workItems = workInner ? Array.from(workInner.children) : [];

            // se muestra un instante para medir la caja y el centro de la nube
            gsap.set(workBox, { visibility: 'visible', scale: 1, opacity: 1 });
            const boxRect = workBox.getBoundingClientRect();
            const blobRect = workBlob.getBoundingClientRect();
            // centro de la nube respecto de la caja
            const originX = (blobRect.left + blobRect.width / 2) - boxRect.left;
            const originY = (blobRect.top + blobRect.height / 2) - boxRect.top;
            const workOrigin = `${originX}px ${originY}px`;

            // arranca cerrada, creciendo desde la nube
            gsap.set(workBox, {
                visibility: 'hidden',
                scale: 0,
                opacity: 0,
                transformOrigin: workOrigin
            });
            gsap.set(workItems, { y: 10, opacity: 0 });
            gsap.set(workBlob, { transformOrigin: 'center center' });

            const onEnterLeft = () => {
                gsap.killTweensOf(workBox);
                gsap.killTweensOf(workItems);
                gsap.killTweensOf(workBlob);
                showOverlay();

                // la nube da un giro rápido al abrir
                gsap.to(workBlob, { rotation: '+=360', duration: 0.7, ease: 'power3.inOut' });

                gsap.set(workBox, { visibility: 'visible' });
                // la caja crece desde la nube
                gsap.fromTo(workBox,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }
                );
                // los ítems aparecen mientras crece
                gsap.to(workItems, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.18 });
            };

            const onLeaveLeft = () => {
                gsap.killTweensOf(workBox);
                gsap.killTweensOf(workItems);
                gsap.killTweensOf(workBlob);
                hideOverlay();

                gsap.to(workBlob, { rotation: 0, duration: 0.5, ease: 'power2.out' });

                // los ítems se van rápido
                gsap.to(workItems, { y: 10, opacity: 0, duration: 0.15, ease: 'power2.in' });
                // la caja vuelve a la nube
                gsap.to(workBox, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'expo.in',
                    delay: 0.05,
                    onComplete: () => gsap.set(workBox, { visibility: 'hidden' })
                });
            };

            navLeft.addEventListener('mouseenter', onEnterLeft);
            navLeft.addEventListener('mouseleave', onLeaveLeft);
            cleanups.push(() => {
                navLeft.removeEventListener('mouseenter', onEnterLeft);
                navLeft.removeEventListener('mouseleave', onLeaveLeft);
            });
        }

        // ─── Ítems del menú: el badge tiembla al pasar el mouse ───
        const workItems = document.querySelectorAll('.nav-menu-item');
        workItems.forEach(item => {
            const badge = item.querySelector('.nav-menu-badge');
            let wiggleTween;

            const onItemEnter = () => {
                // el badge tiembla
                if (badge) {
                    gsap.set(badge, { transformOrigin: 'center center' });
                    wiggleTween = gsap.to(badge, { rotation: 5, duration: 0.15, repeat: -1, yoyo: true, ease: 'steps(1)' });
                }
            };
            const onItemLeave = () => {
                if (wiggleTween) { wiggleTween.kill(); }
                if (badge) gsap.to(badge, { rotation: 0, duration: 0.3, ease: 'power2.out' });
            };
            item.addEventListener('mouseenter', onItemEnter);
            item.addEventListener('mouseleave', onItemLeave);
            cleanups.push(() => {
                item.removeEventListener('mouseenter', onItemEnter);
                item.removeEventListener('mouseleave', onItemLeave);
            });
        });

        // ─── Botón del menú: tiembla al pasar el mouse (la burbuja la maneja CursorBubble) ───
        const workBtn = document.querySelector('.nav-menu-btn');
        if (workBtn) {
            let btnWiggle;
            const onBtnEnter = () => {
                const btnText = workBtn.querySelector('.nav-menu-btn__text');
                if (btnText) {
                    gsap.set(btnText, { transformOrigin: 'center center', display: 'inline-block' });
                    btnWiggle = gsap.to(btnText, { rotation: 4, duration: 0.12, repeat: -1, yoyo: true, ease: 'steps(1)' });
                }
            };
            const onBtnLeave = () => {
                const btnText = workBtn.querySelector('.nav-menu-btn__text');
                if (btnWiggle) { btnWiggle.kill(); }
                if (btnText) gsap.to(btnText, { rotation: 0, duration: 0.3, ease: 'power2.out' });
            };
            workBtn.addEventListener('mouseenter', onBtnEnter);
            workBtn.addEventListener('mouseleave', onBtnLeave);
            cleanups.push(() => {
                workBtn.removeEventListener('mouseenter', onBtnEnter);
                workBtn.removeEventListener('mouseleave', onBtnLeave);
            });
        }

        return () => {
            window.removeEventListener('scroll', updateNavbarColor);
            cleanups.forEach(fn => fn && fn());
        };
    }, []);

    return (
        <>
            <div className="nav-overlay"></div>
            <nav className="navbar">
                <div className="nav-center" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>
                    <a href="/" aria-label="Inicio"><img className="logo-jogging" src="/logo/Logo%20Estudio%20Jogging.svg" alt="Jogging" height="40" /></a>
                </div>
                <div className="nav-left" style={{ cursor: "url('/assets/Cursor SVG/cursor-pointer.svg') 12 12, pointer" }}>
                    <div className="nav-hover-trigger">
                        <div className="logo-menu-container">
                            <img src="/assets/Nubes/1nube-comic.svg" width="60" height="55" className="nav-bar__menu-blob-svg" alt="" aria-hidden="true" />
                            <span className="logo-menu-text">MENÚ</span>
                        </div>

                        {/* caja del menú */}
                        <div className="nav-popout nav-menu-box">
                            <div className="nav-popout-inner">
                                <a href="/nosotros" className="nav-menu-item">
                                    <div className="nav-menu-item__text">
                                        <span className="nav-menu-badge badge-rosa">Nosotros</span>
                                        <h4 className="nav-menu-title">¿quiénes están detrás del estudio?</h4>
                                    </div>
                                </a>
                                <a href="/proyectos" className="nav-menu-item">
                                    <div className="nav-menu-item__text">
                                        <span className="nav-menu-badge badge-naranja">Proyectos</span>
                                        <h4 className="nav-menu-title">lo que creamos para otras marcas</h4>
                                    </div>
                                </a>
                                <a href="/servicios" className="nav-menu-item">
                                    <div className="nav-menu-item__text">
                                        <span className="nav-menu-badge badge-azul">Servicios</span>
                                        <h4 className="nav-menu-title">¿qué podemos hacer por tu marca?</h4>
                                    </div>
                                </a>
                                <a href="#contacto" className="nav-menu-item">
                                    <div className="nav-menu-item__text">
                                        <span className="nav-menu-badge badge-crema">Contacto</span>
                                        <h4 className="nav-menu-title">¿empezamos algo juntos?</h4>
                                    </div>
                                </a>
                                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-menu-btn"><span className="nav-menu-btn__text">Hablemos</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
