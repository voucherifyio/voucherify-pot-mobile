'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import {
    MdCreditCard,
    MdHome,
    MdOutlineLocalOffer,
    MdStars,
} from 'react-icons/md'
import Link from 'next/link'
import { MobileAppContext } from './app-context/app-context'

const Navbar = () => {
    const { status } = useSession()
    const { dealsAndRewards } = useContext(MobileAppContext)

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

    if (status === 'authenticated') {
        return (
            <div className="w-full h-16 bg-white border-t border-gray-200 sticky bottom-0">
                <div className="flex justify-evenly h-full max-w-screen-sm grid-cols-5 mx-auto font-medium">
                    {MENU_LIST.map((item) => (
                        <Link
                            key={item.text}
                            className={`inline-flex flex-col items-center justify-center px-5 relative`}
                            href={item.href}
                        >
                            {dealsAndRewards.deals && item.text === 'Deals' ? (
                                <span className="absolute top-2 right-3 bg-[#173c9f] rounded-xl h-4 w-4 flex justify-center items-center text-white text-[10px]">
                                    {dealsAndRewards.deals}
                                </span>
                            ) : null}
                            {dealsAndRewards.rewards &&
                            item.text === 'Rewards' ? (
                                <span className="absolute top-2 right-6 bg-[#173c9f] rounded-xl h-4 w-4 flex justify-center items-center text-white text-[10px]">
                                    {dealsAndRewards.rewards}
                                </span>
                            ) : null}
                            {item.icon}
                            <p
                                className={`text-sm  ${pathname === item.href ? 'text-blue-text' : 'text-gray-500'}`}
                            >
                                {item.text}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}

export default Navbar
