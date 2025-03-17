import Image from "next/image"
import BurnIcon from '@/public/images/volkswagen/burn.png'
import DealsIcon from '@/public/images/volkswagen/deals.png'
import EarningRulesIcon from '@/public/images/volkswagen/earning-rules.png'
import RightArrowIcon from '@/public/images/volkswagen/right-arrow.png'
import Link from "next/link"

const RESOURCES = [
    {
        text: "Deals",
        icon: <Image src={DealsIcon} alt="Go to" />,
        href: '/deals',
    },
    {
        text: "Earning Rules",
        icon: <Image src={EarningRulesIcon} alt="Go to" />,
        href: '/earning-rules',
    },
    {
        text: "Burning Rewards",
        icon: <Image src={BurnIcon} alt="Go to" />,
        href: '/earn-and-burn',
    }
]

const Resources = () => {
  return (
    <div className="w-full p-4">
        {RESOURCES.map((resource, index) => (
            <div key={index} className="flex items-center w-full gap-2">
                <div className="w-[44px] flex item-center justify-center">
                    {resource.icon}
                </div>
                <Link href={resource.href} style={{ width: '100%' }}>
                    <div className="flex py-4 border-b w-full justify-between">
                        <p>{resource.text}</p>
                        <Image src={RightArrowIcon} alt="Go to" />
                    </div>
                </Link>
            </div>
        ))}
    </div>
  )
}

export default Resources