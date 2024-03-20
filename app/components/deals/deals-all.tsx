'use client'
import Button from '@/app/components/ui/atoms/button'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { useEffect, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { useSession } from 'next-auth/react'
import DealsWithinReach from '@/app/components/deals/deals-within-reach'
interface DealsProps {
    customerId: string
}

export interface Deal {
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
    const [dealsWithinReach, setDealsWithinReach] = useState<Deal[]>([])
    const [conditionalDeals, setConditionalDeals] = useState<Deal[]>([])
    const [
        isEligibleForTheConditionalDeal,
        setIsEligibleForTheConditionalDeal,
    ] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const [currentDealType, setCurrentDealType] = useState<CurrentDeal>(
        CurrentDeal.All
    )

    useEffect(() => {
        const fetchDealsWithinReach = async () => {
            if (customerId) {
                try {
                    const res = await fetch(`/api/voucherify/qualifications`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            customerId,
                            scenario: QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                        }),
                    })

                    const data = await res.json()

                    let activeDealsAndRewards = JSON.parse(
                        localStorage.getItem('activeDealsAndRewards') || '[]'
                    )

                    const updatedDeals = data.qualifications.map(
                        (deal: Deal) => ({
                            ...deal,
                            active: activeDealsAndRewards.includes(deal.id),
                        })
                    )

                    setDealsWithinReach(updatedDeals)
                    localStorage.setItem(
                        'dealsWithinReach',
                        JSON.stringify(updatedDeals)
                    )
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    return err
                }
            }
        }

        const fetchNotYetApplicableDeals = async () => {
            if (customerId) {
                try {
                    const res = await fetch(`/api/voucherify/qualifications`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            customerId,
                            scenario: QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                            customerMetadata: {
                                unique_locations_purchased_at: 3,
                            },
                        }),
                    })

                    const data = await res.json()

                    setConditionalDeals(data.qualifications)

                    // Check if the customer is eligible for the discount
                    try {
                        const res = await fetch(
                            `/api/voucherify/get-customer?phone=${customerPhone}`,
                            {
                                method: 'GET',
                            }
                        )
                        const { customer } = await res.json()
                        if (
                            customer.metadata?.unique_locations_purchased_at >=
                            3
                        ) {
                            setIsEligibleForTheConditionalDeal(true)
                        }
                    } catch (err) {
                        return err
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    return err
                }
            }
        }
        if (!dealsWithinReach || dealsWithinReach.length === 0) {
            fetchDealsWithinReach().catch(console.error)
            fetchNotYetApplicableDeals().catch(console.error)
        }
    }, [])

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

    return (
        <div className="bg-blue-background h-[90%] pt-2">
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
                <DealsWithinReach fetchedDealsWithinReach={dealsWithinReach} />
            )}
            {currentDealType === CurrentDeal.All && (
                <div className="bg-blue-background mx-auto h-auto pt-2">
                    {conditionalDeals.map((deal) => (
                        <div
                            key={deal.id}
                            className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                        >
                            <div className="flex flex-col p-2">
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.name || deal.id}
                                </h3>
                                {/*<h3>{deal?.metadata?.eligibility_condition}</h3>*/}
                                {isEligibleForTheConditionalDeal ? (
                                    <h3 className="pt-1 text-green-700">
                                        ✓ Available
                                    </h3>
                                ) : (
                                    <h3 className="pt-1">
                                        pump in 3 different locations
                                    </h3>
                                )}
                            </div>
                        </div>
                    ))}
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
