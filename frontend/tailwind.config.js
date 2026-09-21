import path from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(frontendDir, 'index.html'),
    path.join(frontendDir, 'src/**/*.{js,jsx,ts,tsx}')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif']
      },
      colors: {
        neural: {
          navy: '#071432',
          blue: '#299dff',
          violet: '#805cff',
          cyan: '#68c9ff'
        }
      },
      boxShadow: {
        glow: '0 8px 22px rgba(46, 141, 255, .22)'
      }
    }
  },
  plugins: []
};
