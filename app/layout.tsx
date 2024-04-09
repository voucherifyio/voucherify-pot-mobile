import '@/app/components/ui/global.css'
import { Metadata } from 'next'
import SessionWrapper from '@/app/components/session-wrapper'
import Navbar from '@/app/components/navbar'
import { inter } from '@/app/components/ui/fonts'
import MobileApp from './components/app-context/app-context'

export const metadata: Metadata = {
    title: {
        template: '%s',
        default: 'Voucherify POT Mobile',
    },
    description: 'Voucherify POT',
    icons: {
        icon: '/images/favicon.ico',
    },
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
                    className={`${inter.className} flex flex-col min-h-screen justify-between mx-auto max-w-screen-sm antialiased`}
                >
                    <MobileApp>
                        <>
                            {children}
                            <Navbar />
                        </>
                    </MobileApp>
                </body>
            </html>
        </SessionWrapper>
    )
}
