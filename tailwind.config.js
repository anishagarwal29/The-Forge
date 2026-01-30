/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}" // Catch root files like App.tsx
    ],
    theme: {
        extend: {
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                magma: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                void: '#050505',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'mesh-spin': 'spin 10s linear infinite',
                'hammer': 'hammer 0.5s ease-in-out infinite',
            },
            keyframes: {
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                hammer: {
                    '0%': { transform: 'rotate(0deg)' },
                    '30%': { transform: 'rotate(-45deg)' },
                    '50%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                }
            }
        },
    },
    plugins: [],
}
