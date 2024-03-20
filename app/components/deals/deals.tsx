'use client'
import { useEffect, useState } from 'react'
import Button from '@/app/components/ui/atoms/button'
import Toast from '@/app/components/ui/atoms/toast'
import { useActiveDeals } from '@/app/hooks/useActiveDeals'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'
import { useSession } from 'next-auth/react'
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
    const [conditionalDeals, setConditionalDeals] = useState<Deal[]>([])
    const [
        isEligibleForTheConditionalDeal,
        setIsEligibleForTheConditionalDeal,
    ] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')
    const { data: session } = useSession()
    const customerPhone = session?.user?.id

    useEffect(() => {
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
                        setErrorMessage(err.message)
                    }
                    return err
                }
            }
        }
        if (!conditionalDeals || conditionalDeals.length === 0) {
            fetchNotYetApplicableDeals().catch(console.error)
        }
    }, [])

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

    return (
        <div className="h-[90%] pt-2">
            {error && <Toast toastText={error} toastType="error" />}
            {errorMessage && (
                <Toast toastText={errorMessage} toastType="error" />
            )}
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
                            className="shadow-md min-h-[80px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                        >
                            <div className="flex flex-col p-2">
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.banner || deal?.name || deal.id}
                                </h3>
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
                </>
            )}
            {currentDealType === CurrentDeal.All && (
                <>
                    {conditionalDeals.map((deal) => (
                        <div
                            key={deal.id}
                            className="shadow-md min-h-[92px] rounded-xl m-2 flex bg-white text-blue-text w-[95%]"
                        >
                            <div className="flex flex-col p-2">
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.banner || deal?.name || deal.id}
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
                    {activeDeals.map((deal) => (
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
                                            handleActivateCoupon(deal.id)
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
                </>
            )}
        </div>
    )
}

export default Deals
