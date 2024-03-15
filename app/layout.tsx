import '@/app/components/ui/global.css'
import { Metadata } from 'next'
import SessionWrapper from './components/session-wrapper'
import Navbar from '@/app/components/navbar'
import { inter } from '@/app/components/ui/fonts'
import { useSession } from 'next-auth/react'
import Toast from '@/app/components/ui/atoms/toast'

export const metadata: Metadata = {
    title: {
        template: '%s | Journie',
        default: 'Journie',
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
                    <Navbar />
                    {children}
                </body>
            </html>
        </SessionWrapper>
    )
}
