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
                const storedDealsWithinReach =
                    localStorage.getItem('dealsWithinReach')
                if (storedDealsWithinReach) {
                    const parsedDeals = JSON.parse(storedDealsWithinReach)
                    setDealsWithinReach(parsedDeals)
                } else {
                    try {
                        const res = await fetch(
                            `/api/qualifications?customerId=${customerId}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                            }
                        )
                        const data = await res.json()
                        data.qualifications.redeemables.data.forEach(
                            (qualification: DealWithinReach) => {
                                qualification.active = false
                                qualification.available = true
                            }
                        )
                        setDealsWithinReach(
                            data.qualifications.redeemables.data
                        )
                    } catch (err) {
                        if (err instanceof Error) {
                            return setError(err.message)
                        }
                        return err
                    }
                }
            }
        }
        if (!dealsWithinReach || dealsWithinReach.length === 0) {
            fetchData().catch(console.error)
        }
    }, [])

    const handleActivateCoupon = async (
        id: string,
        active: boolean,
        available: boolean
    ) => {
        if (available && !active) {
            try {
                const res = await fetch(`/api/validation?coupon=${id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await res.json()
                if (data.validCoupons.valid) {
                    const updatedDeals = dealsWithinReach.map((deal) => {
                        if (deal.id === id) {
                            return {
                                ...deal,
                                active: true,
                                barcode: data.validCoupons.barcode,
                            }
                        }
                        return deal
                    })
                    setDealsWithinReach(updatedDeals)
                    localStorage.setItem(
                        'dealsWithinReach',
                        JSON.stringify(updatedDeals)
                    )
                }
            } catch (err) {
                if (err instanceof Error) {
                    return setError(err.message)
                }
                return err
            }
        }
        if (active) {
            const updatedDeals = dealsWithinReach.map((deal) => {
                if (deal.id === id) {
                    return { ...deal, active: false }
                }
                return deal
            })
            setDealsWithinReach(updatedDeals)
            localStorage.setItem(
                'dealsWithinReach',
                JSON.stringify(updatedDeals)
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
                            className="shadow-md min-h-[92px] rounded-xl m-4 flex bg-white text-blue-text w-[90%]"
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
                                                deal.active,
                                                deal.available
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
            {/*{currentDealType === CurrentDeal.All && (*/}
            {/*    <div className="bg-blue-background mx-auto h-[80%] pt-2">*/}
            {/*        {deals.map((deal) => (*/}
            {/*            <div*/}
            {/*                key={deal.id}*/}
            {/*                className="shadow-md h-[92px] rounded-xl m-4 flex bg-white text-blue-text w-[90%]"*/}
            {/*            >*/}
            {/*                <div className="flex flex-col p-2">*/}
            {/*                    <h3 className="text-[18px] font-extrabold">*/}
            {/*                        {deal?.title}*/}
            {/*                    </h3>*/}
            {/*                    {deal.available ? (*/}
            {/*                        <Button*/}
            {/*                            buttonType={*/}
            {/*                                deal.active*/}
            {/*                                    ? 'activeCoupon'*/}
            {/*                                    : 'yellow'*/}
            {/*                            }*/}
            {/*                            className="mt-2 px-2 max-h-[32px] max-w-[149px] text-[16px]"*/}
            {/*                        >*/}
            {/*                            {deal.active*/}
            {/*                                ? '✓ Active coupon'*/}
            {/*                                : 'Activate coupon'}*/}
            {/*                        </Button>*/}
            {/*                    ) : (*/}
            {/*                        <p>{deal?.eligibilityCondition}</p>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    )
}

export default Deals
