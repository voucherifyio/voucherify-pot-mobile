'use client'
import { useEffect, useState } from 'react'
import Button from '@/app/components/ui/atoms/button'
import Toast from '@/app/components/ui/atoms/toast'
import { useActiveDeals } from '@/app/hooks/useActiveDeals'
import { CAMPAIGNS } from '@/enum/campaigns'
import { SEGMENTS } from '@/enum/segments'
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
        tiers?: { name?: string }[]
    }
}

enum CurrentDeal {
    All = 'All',
    WithinReach = 'Within reach',
}

interface Segment {
    id: string
    name: string
    object: string
}

const Deals: React.FC<DealsProps> = ({ customerId }) => {
    const { activeDeals, setActiveDeals, error } = useActiveDeals({
        customerId,
    })
    const [currentDealType, setCurrentDealType] = useState<CurrentDeal>(
        CurrentDeal.All
    )
    const [conditionalDeals, setConditionalDeals] = useState<Deal[]>([])
    const [
        isNotEligibleForTheConditionalDeal,
        setIsNotEligibleForTheConditionalDeal,
    ] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>('')

    useEffect(() => {
        const fetchNotYetApplicableDeals = async () => {
            // Get the campaign
            if (customerId) {
                try {
                    const res = await fetch(
                        `/api/voucherify/get-campaign?campaignId=${CAMPAIGNS.FREE_COCA_COCA_CAMPAIGN_ID}`,
                        {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        }
                    )

                    const data = await res.json()

                    // Check if the customer is eligible for the discount
                    // List customer's segments and check if the customer is in the segment
                    if (customerId) {
                        try {
                            const res = await fetch(
                                `/api/voucherify/list-customers-segments?customerId=${customerId}`,
                                {
                                    method: 'GET',
                                }
                            )
                            const data = await res.json()
                            if (
                                !data.customersSegments.data.find(
                                    (segment: Segment) =>
                                        segment.name ===
                                        SEGMENTS.CUSTOMER_PURCHASED_3_PLUS_LOCALISATIONS
                                )
                            ) {
                                setIsNotEligibleForTheConditionalDeal(true)
                            } else {
                                setConditionalDeals([])
                                return
                            }
                        } catch (err) {
                            return err
                        }
                    }
                    setConditionalDeals([data.campaign])
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
                                    {(deal?.promotion?.tiers &&
                                        deal?.promotion?.tiers[0].name) ||
                                        deal?.name ||
                                        deal.id}
                                </h3>
                                {/*todo add metadata message here*/}
                                {isNotEligibleForTheConditionalDeal && (
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
        </div>
    )
}

export default Deals
