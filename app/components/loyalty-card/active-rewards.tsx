import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useState } from 'react'
import { useActivatedDealsAndRewards } from '@/app/hooks/useActivatedDealsAndRewards'

const ActiveRewards = () => {
    const { activatedRewards } = useActivatedDealsAndRewards()
    const [expandedReward, setExpandedReward] = useState<string | null>(null)

    const handleExpandCoupon = (id: string) => {
        if (expandedReward === id) {
            setExpandedReward(null)
        } else {
            setExpandedReward(id)
        }
    }

    return (
        <div className="mt-4">
            <header>
                {activatedRewards.length > 0 && (
                    <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                        Active rewards/coupons
                    </h1>
                )}
                {activatedRewards.length === 0 && (
                    <p className="mb-4 text-[14px] font-bold text-blue-text">
                        No active coupons.
                    </p>
                )}
            </header>
            <div>
                {activatedRewards.map((reward) => (
                    <div
                        key={reward.id}
                        onClick={() => handleExpandCoupon(reward.id)}
                        className="shadow-md rounded-xl flex-row justify-between bg-white mt-4 text-blue-text w-full min-h-[92px] items-center"
                    >
                        <h3 className="text-[18px] font-extrabold p-2">
                            {reward?.id}
                        </h3>
                        {expandedReward !== reward.id && (
                            <Button
                                onClick={() => handleExpandCoupon(reward.id)}
                                buttonType="yellow"
                                className="h-[24px] px-2 m-2 text-[16px] rounded-md"
                            >
                                Scan in-store
                            </Button>
                        )}
                        {expandedReward === reward.id &&
                            reward?.barcode?.url && (
                                <Image
                                    src={reward.barcode.url}
                                    alt="couponBarcode"
                                    width={250}
                                    height={65}
                                    className="max-w-auto max-h-auto mx-auto"
                                />
                            )}
                        {expandedReward === reward.id &&
                            !reward?.barcode?.url && (
                                <p className="ml-2">No barcode found!</p>
                            )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveRewards
