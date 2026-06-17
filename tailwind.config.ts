import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0f172a',
        surface: '#1e293b',
        elevated: '#334155',
        card: '#1e293b',
        hairline: '#334155',
        hairlineHover: '#475569',
        ink: '#f8fafc',
        body: '#cbd5e1',
        mute: '#94a3b8',
        ash: '#64748b',
        blue: '#3b82f6',
        red: '#f87171',
        green: '#4ade80',
        yellow: '#fbbf24',
        purple: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '14px',
        btn: '12px',
      },
      boxShadow: {
        glow: 'none',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
