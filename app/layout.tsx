import '@/components/ui/global.css'
import { inter } from '@/components/ui/fonts'
import { Metadata } from 'next'

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
        <html lang="en">
            <body
                className={`${inter.className} mx-auto max-w-screen-sm antialiased`}
            >
                {children}
            </body>
        </html>
    )
}
