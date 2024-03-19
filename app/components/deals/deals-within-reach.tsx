'use client'
import Button from '@/app/components/ui/atoms/button'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { Deal } from '@/app/components/deals/deals-all'
interface DealsProps {
    fetchedDealsWithinReach: Deal[]
}

enum CurrentDeal {
    All = 'All',
    WithinReach = 'Within reach',
}

const DealsWithinReach: React.FC<DealsProps> = ({
    fetchedDealsWithinReach,
}) => {
    const [dealsWithinReach, setDealsWithinReach] = useState<Deal[]>(
        fetchedDealsWithinReach
    )
    const [error, setError] = useState<string | undefined>(undefined)

    const handleActivateCoupon = async (id: string, active: boolean) => {
        let updatedDeals
        if (!active) {
            updatedDeals = dealsWithinReach.map((deal) =>
                deal.id === id ? { ...deal, active: true } : deal
            )
        } else {
            updatedDeals = dealsWithinReach.map((deal) =>
                deal.id === id ? { ...deal, active: false } : deal
            )
        }
        setDealsWithinReach(updatedDeals)

        let activeDealsAndRewards = JSON.parse(
            localStorage.getItem('activeDealsAndRewards') || '[]'
        )

        if (!active) {
            activeDealsAndRewards.push(id)
        } else {
            activeDealsAndRewards = activeDealsAndRewards.filter(
                (dealId: string) =>
                    dealsWithinReach.some((deal) => deal.id === dealId) &&
                    dealId !== id
            )
        }

        localStorage.setItem(
            'activeDealsAndRewards',
            JSON.stringify(activeDealsAndRewards)
        )
    }

    const [currentDealType, setCurrentDealType] = useState<CurrentDeal>(
        CurrentDeal.WithinReach
    )
    return (
        <div className="bg-blue-background h-[90%] pt-2">
            {error && <Toast toastText={error} toastType="error" />}
            {currentDealType === CurrentDeal.WithinReach && (
                <div className="bg-blue-background mx-auto h-auto pt-2">
                    {dealsWithinReach.map((deal) => (
                        <div
                            key={deal.id}
                            className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                        >
                            <div className="flex flex-col p-2">
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.name || deal.id}
                                </h3>
                                {deal.object === 'voucher' && (
                                    <Button
                                        onClick={() =>
                                            handleActivateCoupon(
                                                deal.id,
                                                deal.active
                                            )
                                        }
                                        buttonType={
                                            deal.active
                                                ? 'activeCoupon'
                                                : 'yellow'
                                        }
                                        className="mt-4 px-2 max-h-[32px] max-w-[149px] text-[16px]"
                                    >
                                        {deal.active
                                            ? '✓ Active coupon'
                                            : 'Activate coupon'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <footer className="bg-blue-background h-[40px]"></footer>
        </div>
    )
}

export default DealsWithinReach
