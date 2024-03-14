'use client'
import {
    MdCreditCard,
    MdHome,
    MdOutlineLocalOffer,
    MdStars,
} from 'react-icons/md'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

const Navbar = () => {
    const { status } = useSession()
    //todo change the icon color as well
    const pathname = usePathname()
    const MENU_LIST = [
        {
            text: 'Home',
            href: '/home',
            icon: <MdHome color="gray" />,
        },
        {
            text: 'Deals',
            href: '/deals',
            icon: <MdOutlineLocalOffer color="gray" />,
        },
        {
            text: 'Card',
            href: '/card',
            icon: <MdCreditCard color="gray" />,
        },
        {
            text: 'Rewards',
            href: '/rewards',
            icon: <MdStars color="gray" />,
        },
    ]
    return (
        <>
            {status && status === 'authenticated' && (
                <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
                    <div className="flex justify-evenly h-full max-w-screen-sm grid-cols-5 mx-auto font-medium">
                        {MENU_LIST.map((item) => (
                            <Link
                                key={item.text}
                                className={`inline-flex flex-col items-center justify-center px-5 `}
                                href={item.href}
                            >
                                {item.icon}
                                <span
                                    className={`text-sm  ${pathname === item.href ? 'text-blue-text' : 'text-gray-500'}`}
                                >
                                    {item.text}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
