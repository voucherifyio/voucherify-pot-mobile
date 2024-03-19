import '@/app/components/ui/global.css'
import { Metadata } from 'next'
import SessionWrapper from './components/session-wrapper'
import Navbar from '@/app/components/navbar'
import { inter } from '@/app/components/ui/fonts'
import LocalStorage from './components/vouchers-amount-context/vouchers-amount-context'

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
                    className={`${inter.className} flex flex-col min-h-screen justify-between mx-auto max-w-screen-sm antialiased`}
                >
                    <LocalStorage>
                        <>
                            {children}
                            <Navbar />
                        </>
                    </LocalStorage>
                </body>
            </html>
        </SessionWrapper>
    )
}
