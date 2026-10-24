// Diseño y desarrollo: florentin.studio
import './globals.css';

// dirección pública del sitio (si se conecta un dominio propio, cambiarla acá)
const SITE_URL = 'https://estudiojogging.netlify.app';
const description = 'Estudio creativo en movimiento: diseño, comunicación y tecnología 3D para marcas que buscan coherencia, estética y ese "no sé qué" editorial.';

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: 'Estudio Jogging',
    description,
    icons: {
        icon: '/logo/Isologo.svg',
    },
    openGraph: {
        title: 'Estudio Jogging',
        description,
        url: SITE_URL,
        siteName: 'Estudio Jogging',
        images: ['/assets/hero-escritorio.png'],
        locale: 'es_AR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Estudio Jogging',
        description,
        images: ['/assets/hero-escritorio.png'],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
