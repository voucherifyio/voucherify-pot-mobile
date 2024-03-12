import '@/app/components/ui/global.css'
import { Metadata } from 'next'
import SessionWrapper from './components/SessionWrapper'
import Navbar from '@/app/components/navbar'
import { inter } from '@/app/components/ui/fonts'

export const metadata: Metadata = {
    title: {
        template: '%s | Parkland',
        default: 'Parkland',
    },
    description: 'Parkland POT',
}

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <SessionWrapper>
            <html lang="en">
            <body
                className={`${inter.className} mx-auto max-w-screen-sm antialiased`}
            >
            <Navbar />
            {children}
            </body>
            </html>
        </SessionWrapper>
    )
}



