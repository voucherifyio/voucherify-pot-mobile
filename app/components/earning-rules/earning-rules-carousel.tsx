'use client'
import { FaArrowRight } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ScrollContainer from 'react-indiana-drag-scroll'
import { useGetEarningRules } from '@/app/hooks/useGetEarningRules'

interface EarningRulesCarouselProps {}
const EarningRulesCarousel: React.FC<EarningRulesCarouselProps> = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const customerId = session?.user?.id
    const { earningRules, error, loading } = useGetEarningRules({ customerId })

    const handleEarningRulesRedirectClick = () => {
        router.push('/earning-rules')
    }

    return (
        <>
            <div className="flex justify-between mx-5">
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
            {loading ? (
                <EarningRulesLoading />
            ) : (
                <ScrollContainer
                    component={'div'}
                    className="scroll-container flex ml-2 w-full"
                    buttons={[1, 2, 3, 4]}
                >
                    {earningRules?.slice(0, 4)?.map((earningRule) => (
                        <div
                            key={earningRule.id}
                            className="p-2 shadow-md min-h-[60px] rounded-xl my-4 mx-2 bg-white text-blue-text min-w-[70%]"
                        >
                            <h3 className="text-[18px] font-extrabold">
                                {earningRule?.source?.banner || earningRule?.id}
                            </h3>
                        </div>
                    ))}
                </ScrollContainer>
            )}
        </>
    )
}

const EarningRulesLoading = () => (
    <div className="w-full flex justify-center items-center bg-inherit m-2">
        <p>Loading...</p>
    </div>
)
export default EarningRulesCarousel
