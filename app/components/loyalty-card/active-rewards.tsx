import { useState } from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useActivatedDealsAndRewards } from '@/app/hooks/useActivatedDealsAndRewards'
import Loading from '@/app/components/loading/loading'

const ActiveRewards = () => {
    const { activatedRewards, loading } = useActivatedDealsAndRewards()
    const [expandedReward, setExpandedReward] = useState<string | null>(null)

    const handleExpandCoupon = (id: string) => {
        if (expandedReward === id) {
            setExpandedReward(null)
        } else {
            setExpandedReward(id)
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="mt-4">
            <header>
                {activatedRewards.length > 0 ? (
                    <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                        Active rewards/coupons
                    </h1>
                ) : (
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
                        className="flex flex-col shadow-md rounded-xl flex-row bg-white mt-4 text-blue-text w-full min-h-[92px] p-2"
                    >
                        <h3 className="text-[16px] font-bold">
                            {reward.campaign_name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                            {expandedReward !== reward.id && (
                                <Button
                                    onClick={() =>
                                        handleExpandCoupon(reward.id)
                                    }
                                    buttonType="yellow"
                                    className="h-[24px] text-[16px] rounded-md px-2"
                                >
                                    Scan in-store
                                </Button>
                            )}
                            <h3 className="text-[18px] font-extrabold">
                                {reward?.id}
                            </h3>
                        </div>
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
