'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import {
    MdCreditCard,
    MdHome,
    MdOutlineLocalOffer,
    MdStars,
    MdLocalFireDepartment,
} from 'react-icons/md'
import Link from 'next/link'
import { MobileAppContext } from './app-context/app-context'
import { CAMPAIGNS } from '@/enum/campaigns'

const Navbar = () => {
    const { status } = useSession()
    const { dealsAndRewards, customer, loyaltyCampaignName } =
        useContext(MobileAppContext)
    const pathname = usePathname()

    const LOYALTY_PROGRAM_MENU = [
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

    const filteredRewardsTab = LOYALTY_PROGRAM_MENU.filter(
        (menu) => menu.text !== 'Rewards'
    )

    const EARN_AND_BURN_MENU = [
        ...filteredRewardsTab,
        {
            text: 'Earn and burn',
            href: '/earn-and-burn',
            icon: <MdLocalFireDepartment color="gray" />,
        },
    ]

    if (status === 'loading') {
        return null
    }

    if (status === 'authenticated') {
        return (
            <div className="w-full h-16 bg-white border-t border-gray-200 sticky bottom-0">
                <div className="flex justify-evenly h-full max-w-screen-sm grid-cols-5 mx-auto font-medium">
                    {(loyaltyCampaignName !== CAMPAIGNS.LOYALTY_PROGRAM
                        ? EARN_AND_BURN_MENU
                        : LOYALTY_PROGRAM_MENU
                    ).map((item) => (
                        <Link
                            key={item.text}
                            className={`inline-flex flex-col items-center justify-center relative px-2`}
                            href={item.href}
                        >
                            {dealsAndRewards.deals && item.text === 'Deals' ? (
                                <span className="absolute top-2 -right-0 bg-[#173c9f] rounded-xl h-4 w-4 flex justify-center items-center text-white text-[10px]">
                                    {!customer ? null : dealsAndRewards.deals}
                                </span>
                            ) : null}
                            {dealsAndRewards.rewards &&
                            item.text === 'Rewards' ? (
                                <span className="absolute top-2 right-1 bg-[#173c9f] rounded-xl h-4 w-4 flex justify-center items-center text-white text-[10px]">
                                    {!customer ? null : dealsAndRewards.rewards}
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
