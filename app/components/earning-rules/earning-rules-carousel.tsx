'use client'

import { FaArrowRight } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EarningRulesCarouselProps {}
export interface EarningRule {
    id: string
    name?: string
}

const EarningRulesCarousel: React.FC<EarningRulesCarouselProps> = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const customerId = session?.user?.id
    const [earningRules, setEarningRules] = useState<EarningRule[]>([])
    const [error, setError] = useState<string | undefined>(undefined)

    const handleEarningRulesRedirectClick = () => {
        router.push('/earning-rules')
    }

    const firstEarningRule = earningRules[0]

    return (
        <>
            <div className="flex justify-between mx-8 h-[32px]">
                <h1 className="text-blue-text text-18 font-bold">
                    Earning rules
                </h1>
                <button
                    onClick={handleEarningRulesRedirectClick}
                    className="flex items-center h-[32px] text-[16px] font-normal text-blue-text px-4 rounded bg-blue-background border border-blue-activeCoupon"
                >
                    See all
                    <span className="pl-2">
                        <FaArrowRight />
                    </span>
                </button>
            </div>
            <div>
                <div className="ml-2 relative min-h-[80px] overflow-hidden rounded-lg md:h-96">
                    <div
                        key={firstEarningRule?.name || firstEarningRule?.id}
                        className="shadow-md min-h-[60px] rounded-xl m-4 flex bg-white text-blue-text w-[80%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {firstEarningRule?.name || firstEarningRule?.id}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EarningRulesCarousel
