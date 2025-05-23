import { transform } from 'next/dist/build/swc';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      spacing: {
        '18': '4.5rem',
        '19': '4.75rem',
      },
      transitionProperty: {
        height: 'height',
      },
      height: {
        '250': '62.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
