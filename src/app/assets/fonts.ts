import { Cabin, Merriweather, Montserrat } from 'next/font/google';

export const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Ajustes para diferentes pesos según necesidad
});

export const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'], // Usar para encabezados
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '400', // Usar para subtítulos o botones
});
