import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next'
import SessionWrapper from './components/SessionWrapper'

export const metadata: Metadata = {
    title: {
        template: '%s | Parkland',
        default: 'Parkland',
    },
    description: 'Parkland POT',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionWrapper>
            <html lang="en">
                <body
                    className={`${inter.className} mx-auto max-w-screen-sm antialiased`}
                >
                    {children}
                </body>
            </html>
        </SessionWrapper>
    )
}
