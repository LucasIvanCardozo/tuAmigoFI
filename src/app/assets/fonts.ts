import { Cabin, Merriweather, Montserrat } from 'next/font/google';

export const cabin = Cabin({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});
