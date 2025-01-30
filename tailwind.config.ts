import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            spacing: {
                '50': '12.5rem',
                '100': '25rem',
                '112': '28rem',
                '128': '32rem',
                '150': '37.5rem',
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                brand: {
                    dark: '#103C76',
                    light: '#285590',
                    gray: '#3E3E3E99',
                },
                overlay: '#3E3E3E',
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
}

export default config
