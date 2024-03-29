'use client'
import { useState } from 'react'
import Button from '@/app/components/ui/atoms/button'
import Toast from '@/app/components/ui/atoms/toast'
import { useActiveDeals } from '@/app/hooks/useActiveDeals'
import Loading from '@/app/components/loading/loading'
import { useConditionalDeals } from '@/app/hooks/useFetchConditionalDeals'
interface DealsProps {
    customerId: string
}

export interface Deal {
    name?: string
    id: string
    banner?: string
    object: 'campaign' | 'voucher'
    created_at: string
    campaign_name?: string
    campaign_id?: string
    result?: {}
    applicable_to?: {}
    inapplicable_to?: {}
    active: boolean
    metadata: {}
    promotion?: {
        tiers?: {
            name?: string
            metadata?: {
                promotion_details?: string
            }
        }[]
    }
}

enum CurrentDeal {
    All = 'All',
    WithinReach = 'Within reach',
}

const Deals: React.FC<DealsProps> = ({ customerId }) => {
    const { activeDeals, setActiveDeals, error } = useActiveDeals({
        customerId,
    })
    const [currentDealType, setCurrentDealType] = useState<CurrentDeal>(
        CurrentDeal.WithinReach
    )
    const { conditionalDeals, isNotEligibleForTheConditionalDeal, loading } =
        useConditionalDeals({
            customerId,
        })

    const handleActivateCoupon = async (id: string) => {
        const activeDealsAndRewards = JSON.parse(
            localStorage.getItem('activeDealsAndRewards') || '[]'
        )

        const updatedActiveDealsAndRewards = activeDealsAndRewards.includes(id)
            ? [...activeDealsAndRewards.filter((item: string) => item !== id)]
            : [...activeDealsAndRewards, id]

        localStorage.setItem(
            'activeDealsAndRewards',
            JSON.stringify(updatedActiveDealsAndRewards)
        )

        const updatedDeals = activeDeals.map((deal: Deal) => {
            if (updatedActiveDealsAndRewards.includes(deal.id)) {
                return { ...deal, active: true }
            }
            return { ...deal, active: false }
        })

        setActiveDeals(updatedDeals)
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="pt-2">
            {error && <Toast toastText={error} toastType="error" />}
            <ul className="my-2 justify-center flex text-[16px] font-bold text-center text-gray-500">
                <li>
                    <button
                        key={CurrentDeal.All}
                        onClick={() => setCurrentDealType(CurrentDeal.All)}
                        className={`max-w-[150px] w-[150px] inline-block px-4 py-3 text-blue-text rounded-[30px] ${
                            currentDealType === CurrentDeal.All
                                ? 'active bg-white'
                                : 'bg-[#d1d6e8]'
                        }`}
                    >
                        {CurrentDeal.All}
                    </button>
                </li>
                <li>
                    <button
                        key={CurrentDeal.WithinReach}
                        onClick={() =>
                            setCurrentDealType(CurrentDeal.WithinReach)
                        }
                        className={`ml-2 max-w-[150px] w-[150px] inline-block text-blue-text px-4 py-3 rounded-[30px] ${
                            currentDealType === CurrentDeal.WithinReach
                                ? 'active bg-white'
                                : 'bg-[#d1d6e8]'
                        }`}
                    >
                        {CurrentDeal.WithinReach}
                    </button>
                </li>
            </ul>
            {currentDealType === CurrentDeal.WithinReach && (
                <>
                    {activeDeals.map((deal) => (
                        <div
                            key={deal.id}
                            className="flex flex-col justify-end shadow-md min-h-[80px] rounded-xl m-2 flex bg-white text-blue-text w-[95%] p-2 gap-4"
                        >
                            <h3 className="text-[16px] font-bold">
                                {deal.campaign_name}
                            </h3>
                            <div className="flex gap-4 items-end w-full">
                                {deal.object === 'voucher' && (
                                    <Button
                                        onClick={() =>
                                            handleActivateCoupon(deal.id)
                                        }
                                        buttonType={
                                            deal.active
                                                ? 'activeCoupon'
                                                : 'yellow'
                                        }
                                        className="px-2 max-h-[32px] max-w-[149px] text-[16px]"
                                    >
                                        {deal.active
                                            ? '✓ Active coupon'
                                            : 'Activate coupon'}
                                    </Button>
                                )}
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.banner || deal?.name || deal.id}
                                </h3>
                            </div>
                        </div>
                    ))}
                </>
            )}
            {currentDealType === CurrentDeal.All && (
                <>
                    {conditionalDeals.length > 0 &&
                        conditionalDeals.map((deal) => (
                            <div
                                key={deal.id}
                                className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                            >
                                <div className="flex flex-col p-2">
                                    <h3 className="text-[18px] font-extrabold">
                                        {(deal?.promotion?.tiers &&
                                            deal?.promotion?.tiers[0].name) ||
                                            deal?.name ||
                                            deal.id}
                                    </h3>
                                    {isNotEligibleForTheConditionalDeal && (
                                        <h3 className="pt-1">
                                            {deal?.promotion?.tiers &&
                                                deal?.promotion?.tiers[0]
                                                    .metadata
                                                    ?.promotion_details}
                                        </h3>
                                    )}
                                </div>
                            </div>
                        ))}
                    {activeDeals.map((deal) => (
                        <div
                            key={deal.id}
                            className="flex flex-col justify-end shadow-md min-h-[80px] rounded-xl m-2 flex bg-white text-blue-text w-[95%] p-2 gap-4"
                        >
                            <h3 className="text-[16px] font-bold">
                                {deal.campaign_name}
                            </h3>
                            <div className="flex gap-4 items-end w-full">
                                {deal.object === 'voucher' && (
                                    <Button
                                        onClick={() =>
                                            handleActivateCoupon(deal.id)
                                        }
                                        buttonType={
                                            deal.active
                                                ? 'activeCoupon'
                                                : 'yellow'
                                        }
                                        className="px-2 max-h-[32px] max-w-[149px] text-[16px]"
                                    >
                                        {deal.active
                                            ? '✓ Active coupon'
                                            : 'Activate coupon'}
                                    </Button>
                                )}
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.banner || deal?.name || deal.id}
                                </h3>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default Deals
