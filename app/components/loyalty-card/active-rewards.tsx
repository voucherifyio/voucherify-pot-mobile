import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useEffect, useState } from 'react'
import { DealWithinReach } from '@/app/components/deals/deals'

interface ActiveReward {
    id: string
    barcode?: {
        url?: string
        id?: string
    }
}

const ActiveRewards = () => {
    const [expandedReward, setExpandedReward] = useState<string | null>(null)
    const [activeRewards, setActiveRewards] = useState<ActiveReward[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const dealsWithinReachFromLocalStorage =
                localStorage.getItem('dealsWithinReach')
            if (!dealsWithinReachFromLocalStorage) return

            let dealsWithinReach = JSON.parse(dealsWithinReachFromLocalStorage)

            const activeDealsIdsWithinReach = JSON.parse(
                localStorage.getItem('activeDealsIdsWithinReach') || '[]'
            )

            dealsWithinReach = dealsWithinReach.map(
                (deal: DealWithinReach) => ({
                    ...deal,
                    active: activeDealsIdsWithinReach.includes(deal.id),
                })
            )

            const fetchBarcode = async (deal: DealWithinReach) => {
                const barcodesRes = await fetch(
                    `/api/get-voucher-barcode?coupon=${deal.id}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                )
                const data = await barcodesRes.json()
                return {
                    ...deal,
                    barcode: data.barcode,
                }
            }

            const activeDeals = dealsWithinReach.filter(
                (deal: DealWithinReach) => deal.active
            )
            const barcodePromises = activeDeals.map(fetchBarcode)
            const updatedDeals = await Promise.all(barcodePromises)
            setActiveRewards(updatedDeals)
        }

        fetchData().catch(console.error)
    }, [])

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
                {activeRewards.length > 0 && (
                    <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                        Active rewards/coupons
                    </h1>
                )}
                {activeRewards.length === 0 && (
                    <p className="mb-4 text-[14px] font-bold text-blue-text">
                        No active coupons.
                    </p>
                )}
            </header>
            <div>
                {activeRewards.map((reward) => (
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
