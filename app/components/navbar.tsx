'use client'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useContext } from 'react'
import BurnIcon from '@/public/images/volkswagen/burn.png'
import BurnActiveIcon from '@/public/images/volkswagen/burn-active.png'
import CardIcon from '@/public/images/volkswagen/card.png'
import CardActiveIcon from '@/public/images/volkswagen/card-active.png'
import DealsIcon from '@/public/images/volkswagen/deals.png'
import DealsActiveIcon from '@/public/images/volkswagen/deals-active.png'
import RewardsIcon from '@/public/images/volkswagen/rewards.png'
import RewardsActiveIcon from '@/public/images/volkswagen/rewards-active.png'
import HomeIcon from '@/public/images/volkswagen/home.png'
import HomeActiveIcon from '@/public/images/volkswagen/home-active.png'
import Link from 'next/link'
import { MobileAppContext } from './app-context/app-context'
import { CAMPAIGNS } from '@/enum/campaigns'
import Image from 'next/image'

const Navbar = () => {
    const { status } = useSession()
    const { dealsAndRewards, customer, loyaltyCampaignName } =
        useContext(MobileAppContext)
    const pathname = usePathname()

    const LOYALTY_PROGRAM_MENU = [
        {
            text: 'Home',
            href: '/home',
            icon: <Image src={HomeIcon} alt="Home" width={30} />,
            activeIcon: <Image src={HomeActiveIcon} alt="Home" width={30} />,
        },
        {
            text: 'Deals',
            href: '/deals',
            icon: <Image src={DealsIcon} alt="Deals" width={30} />,
            activeIcon: <Image src={DealsActiveIcon} alt="Deals" width={30} />,
        },
        {
            text: 'Card',
            href: '/card',
            icon: <Image src={CardIcon} alt="Loyalty card" width={30} />,
            activeIcon: (
                <Image src={CardActiveIcon} alt="Loyalty card" width={30} />
            ),
        },
        {
            text: 'Rewards',
            href: '/rewards',
            icon: <Image src={RewardsIcon} alt="Rewards" width={30} />,
            activeIcon: (
                <Image src={RewardsActiveIcon} alt="Rewards" width={30} />
            ),
        },
    ]

    const EARN_AND_BURN_MENU = [
        ...LOYALTY_PROGRAM_MENU,
        {
            text: 'Burn',
            href: '/earn-and-burn',
            icon: <Image src={BurnIcon} alt="Burn" width={30} />,
            activeIcon: <Image src={BurnActiveIcon} alt="Burn" width={30} />,
        },
    ]

    if (status === 'loading') {
        return null
    }

    if (status === 'authenticated') {
        return (
            <div className="w-full h-16 bg-white sticky bottom-0">
                <div className="flex justify-evenly h-full max-w-screen-sm grid-cols-5 mx-auto font-medium">
                    {EARN_AND_BURN_MENU.map((item) => (
                        <Link
                            key={item.text}
                            className={`inline-flex flex-col items-center justify-center relative px-2`}
                            href={item.href}
                        >
                            {item.href === pathname
                                ? item.activeIcon
                                : item.icon}
                        </Link>
                    ))}
                </div>
            </div>
        )
    }
}

export default Navbar
