import {
    MdCreditCard,
    MdHome,
    MdOutlineLocalOffer,
    MdOutlineMap,
    MdStars,
} from 'react-icons/md'
import Link from 'next/link'

const Navbar = () => {
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
            text: 'Map',
            href: '/map',
            icon: <MdOutlineMap color="gray" />,
        },
        {
            text: 'Reward',
            href: '/reward',
            icon: <MdStars color="gray" />,
        },
    ]
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
            <div className="grid h-full max-w-screen-sm grid-cols-5 mx-auto font-medium">
                {MENU_LIST.map((item) => (
                    <Link
                        className="inline-flex flex-col items-center justify-center px-5 "
                        href={item.href}
                    >
                        {item.icon}
                        <span className="text-sm text-gray-500">
                            {item.text}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Navbar
