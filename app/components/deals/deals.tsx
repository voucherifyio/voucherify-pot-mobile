'use client'
import Button from '@/app/components/ui/atoms/button'
import { useEffect, useState } from 'react'
interface DealsProps {
    customerId: string
}

export interface DealWithinReach {
    id: string
    name?: string
    object: 'campaign' | 'voucher'
    created_at: string
    result?: {
        loyalty_card?: {
            points?: number
        }
    }
    applicable_to?: {}
    inapplicable_to?: {}
    active: boolean
    available: boolean
}

enum CurrentDeal {
    All = 'All',
    WithinReach = 'Within reach',
}

const Deals: React.FC<DealsProps> = ({ customerId }) => {
    const [dealsWithinReach, setDealsWithinReach] = useState<DealWithinReach[]>(
        []
    )
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            if (customerId) {
                try {
                    const res = await fetch(
                        `/api/qualifications?customerId=${customerId}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                        }
                    )
                    const data = await res.json()

                    let activeDealsIdsWithinReach = JSON.parse(
                        localStorage.getItem('activeDealsIdsWithinReach') ||
                            '[]'
                    )

                    const updatedDeals =
                        data.qualifications.redeemables.data.map((deal) => ({
                            ...deal,
                            active: activeDealsIdsWithinReach.includes(deal.id),
                        }))
                    setDealsWithinReach(updatedDeals)
                    localStorage.setItem(
                        'dealsWithinReach',
                        JSON.stringify(updatedDeals)
                    )
                } catch (err) {
                    if (err instanceof Error) {
                        return setError(err.message)
                    }
                    return err
                }
            }
        }
        if (!dealsWithinReach || dealsWithinReach.length === 0) {
            fetchData().catch(console.error)
        }
    }, [])

    const handleActivateCoupon = async (id: string, active: boolean) => {
        if (!active) {
            const updatedDeals = dealsWithinReach.map((deal) => {
                if (deal.id === id) {
                    return { ...deal, active: true }
                }
                return deal
            })
            setDealsWithinReach(updatedDeals)
            let activeDealsIdsWithinReach = JSON.parse(
                localStorage.getItem('activeDealsIdsWithinReach') || 'null'
            )

            if (!activeDealsIdsWithinReach) {
                activeDealsIdsWithinReach = []
            }

            activeDealsIdsWithinReach.push(id)

            localStorage.setItem(
                'activeDealsIdsWithinReach',
                JSON.stringify(activeDealsIdsWithinReach)
            )
        } else if (active) {
            const updatedDeals = dealsWithinReach.map((deal) => {
                if (deal.id === id) {
                    return { ...deal, active: false }
                }
                return deal
            })
            setDealsWithinReach(updatedDeals)
            let activeDealsIdsWithinReach = JSON.parse(
                localStorage.getItem('activeDealsIdsWithinReach') || 'null'
            )

            localStorage.setItem(
                'activeDealsIdsWithinReach',
                JSON.stringify(
                    activeDealsIdsWithinReach.filter(
                        (dealId: string) => dealId !== id
                    )
                )
            )
        }
    }

    const [currentDealType, setCurrentDealType] = useState<CurrentDeal>(
        CurrentDeal.WithinReach
    )
    return (
        <div className="bg-blue-background h-[90%] pt-2">
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

export default Deals
