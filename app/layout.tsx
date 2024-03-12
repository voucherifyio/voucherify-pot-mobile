import '@/app/components/ui/global.css'
import { inter } from '@/app/components/ui/fonts'
import { Metadata } from 'next'
import SessionWrapper from './components/SessionWrapper'
import Navbar from '@/app/components/navbar'

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
    // todo show navigation only on home screen (or when logged in)s
    return (
        <><SessionWrapper>
            <html lang="en">
            <body
                className={`${inter.className} mx-auto max-w-screen-sm antialiased`}
            >
            {children}
            </body>
            </html>
        </SessionWrapper>
            <html lang="en">
            <body
                className={`${inter.className} mx-auto max-w-screen-sm antialiased`}
            >
            <Navbar />
            {children}
            </body>
            </html>
        </>
    )
}
