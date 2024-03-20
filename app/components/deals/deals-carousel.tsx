'use client'

import { FaArrowRight } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUALIFICATION_SCENARIO } from '@/enum/qualifications-scenario.enum'

interface DealsCarouselProps {}
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

const DealsCarousel: React.FC<DealsCarouselProps> = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const customerId = session?.user?.id
    const [dealsWithinReach, setDealsWithinReach] = useState<DealWithinReach[]>(
        []
    )
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
                            `/api/voucherify/qualifications`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    customerId,
                                    scenario:
                                        QUALIFICATION_SCENARIO.AUDIENCE_ONLY,
                                }),
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

    const firstDeal = dealsWithinReach[0]

    const handleDealsRedirectClick = () => {
        router.push('/deals')
    }

    const [error, setError] = useState<string | undefined>(undefined)
    return (
        <>
            <div className="flex justify-between mx-8 h-[20px]">
                <h1 className="text-blue-text text-18 font-bold">Deals</h1>
                <button
                    onClick={handleDealsRedirectClick}
                    className="flex items-center h-[32px] text-[16px] font-normal text-blue-text px-4 rounded bg-blue-background border border-blue-activeCoupon"
                >
                    See all
                    <span className="pl-2">
                        <FaArrowRight />
                    </span>
                </button>
            </div>
            <div>
                <div className="ml-2 relative mb-4 overflow-hidden rounded-lg">
                    <div
                        key={firstDeal?.name || firstDeal?.id}
                        className="shadow-md min-h-[60px] rounded-xl m-6 flex bg-white text-blue-text w-[80%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {firstDeal?.name || firstDeal?.id}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DealsCarousel
