'use client'
import { FaArrowRight } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CAMPAIGNS } from '@/enum/campaigns'
import { EarningRule } from '@/app/components/earning-rules/earning-rules'

interface EarningRulesCarouselProps {}
const EarningRulesCarousel: React.FC<EarningRulesCarouselProps> = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const customerId = session?.user?.id
    const [earningRules, setEarningRules] = useState<EarningRule[]>([])
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(() => {
        const fetchEarningRules = async () => {
            try {
                const res = await fetch(
                    `/api/voucherify/list-earning-rules?campaignId=${CAMPAIGNS.JOURNIE_POT_LOYALTY_PROGRAM_ID}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    }
                )

                const data = await res.json()
                const fetchedEarningRules = data.earningRules.data
                setEarningRules(fetchedEarningRules)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
                return err
            }
        }

        if (!earningRules || earningRules.length === 0) {
            fetchEarningRules().catch(console.error)
        }
    }, [])

    const handleEarningRulesRedirectClick = () => {
        router.push('/earning-rules')
    }

    const firstEarningRule = earningRules[0]

    return (
        <>
            <div className="flex justify-between mx-8">
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
                <div className="ml-2 relative mb-4 overflow-hidden rounded-lg">
                    <div
                        key={
                            firstEarningRule?.source?.banner ||
                            firstEarningRule?.id
                        }
                        className="shadow-md min-h-[60px] rounded-xl m-4 flex bg-white text-blue-text w-[80%]"
                    >
                        <div className="flex flex-col p-2">
                            <h3 className="text-[18px] font-extrabold">
                                {firstEarningRule?.source?.banner ||
                                    firstEarningRule?.id}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EarningRulesCarousel
