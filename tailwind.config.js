/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trl: {
          sidebar: '#580477',
          sidebarDark: '#44025d',
          sidebarLight: '#6e0795',
          gold: '#fec817',
          goldLight: '#fde078',
          goldPill: '#f8df80',
          goldText: '#925807',
          purpleDark: '#39024f',
          purple: '#670a8d',
          purpleBtn: '#620885',
          purpleBtnHover: '#790ea3',
          lavenderBg: '#f7f1fc',
          cardBorder: '#e8d9f4',
          cardBg: '#ffffff',
          accentPink: '#e4368a',
          accentCyan: '#0fa3b1'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'trl-card': '0 4px 20px -2px rgba(100, 10, 140, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'trl-glow': '0 0 25px rgba(243, 191, 32, 0.4)',
        'trl-purple-glow': '0 0 30px rgba(120, 15, 170, 0.35)',
        'trl-pill': '0 2px 8px rgba(248, 223, 128, 0.5)',
      }
    },
  },
  plugins: [],
}
