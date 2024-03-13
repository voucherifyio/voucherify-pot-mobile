import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useState } from 'react'

interface ActiveRewards {
    title: string
    barcode: string
}

const ActiveRewards = () => {
    const activeRewards: ActiveRewards[] = [
        {
            title: 'Free package of bubble gum',
            barcode: require('../../public/images/loyalty-card.png'), // TODO: should be a URL
        },
        {
            title: 'Free coca-cola',
            barcode: require('../../public/images/loyalty-card.png'),
        },
    ]

    const [expandedReward, setExpandedReward] = useState<string | null>(null)

    const handleExpandCoupon = (title: string) => {
        setExpandedReward((prevReward) => (prevReward === title ? null : title))
    }

    return (
        <div className="mt-4">
            <header>
                <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                    Active rewards/coupons
                </h1>
            </header>
            <div>
                {activeRewards.map((reward) => (
                    <div
                        key={reward.title}
                        onClick={() => handleExpandCoupon(reward.title)}
                        className="shadow-md rounded-xl flex-row justify-between bg-white mt-4 text-blue-text w-full min-h-[92px] items-center"
                    >
                        <h3 className="text-[18px] font-extrabold p-2">
                            {reward?.title}
                        </h3>
                        {expandedReward !== reward.title && (
                            <Button
                                onClick={() => handleExpandCoupon(reward.title)}
                                buttonType="yellow"
                                className="h-[24px] px-2 m-2 text-[16px] rounded-md"
                            >
                                Scan in-store
                            </Button>
                        )}
                        {expandedReward === reward.title && (
                            <Image
                                src={reward.barcode}
                                alt="couponBarcode"
                                width={350}
                                height={65}
                                className="max-w-auto max-h-auto mx-auto"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveRewards
