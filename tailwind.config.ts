import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                '13': 'repeat(13, minmax(0, 1fr))',
            },
            colors: {
                blue: {
                    text: '#173C9F',
                    background: '#ECF0FB',
                    formInput: '#38477B',
                    inputOutlineActive: '#0D2B9D',
                    activeCoupon: '#0D2B9D1F',
                    inputOutlineDefault: '#5D73BF',
                    activeCouponBorder: '#5A6EBC',
                },
                yellow: {
                    button: '#FBBC05',
                },
                gray: {
                    background: '#64729d'
                },
                green: {
                    background: '#22c55e'
                }
            },
        },
        keyframes: {
            shimmer: {
                '100%': {
                    transform: 'translateX(100%)',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
export default config
