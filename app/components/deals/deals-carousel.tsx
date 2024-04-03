'use client'
import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import { useDealsCarousel } from '@/app/hooks/useDealsCarousel'
import ScrollContainer from 'react-indiana-drag-scroll'

type DealsCarouselProps = {
    customerId: string | null | undefined
}

const DealsCarousel: FC<DealsCarouselProps> = ({ customerId }) => {
    const router = useRouter()
    const { activeDeals, loading } = useDealsCarousel({
        customerId,
    })

    const handleDealsRedirectClick = () => {
        router.push('/deals')
    }

    return (
        <>
            <div className="flex justify-between mx-5">
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
            {activeDeals?.length === 0 && (
                <div className="py-3 flex justify-center items-center">
                    <p className="text-[14px] font-bold text-blue-text">
                        No active deals
                    </p>
                </div>
            )}
            {loading ? (
                <DealsLoading />
            ) : (
                <ScrollContainer
                    component={'div'}
                    className="scroll-container flex ml-2 w-full"
                    buttons={[1, 2, 3, 4]}
                >
                    {activeDeals?.slice(0, 4)?.map((deal) => (
                        <div
                            key={deal.id}
                            className="shadow-md min-h-[60px] min-w-[70%] rounded-xl my-4 mx-2 bg-white text-blue-text p-2"
                        >
                            <h3 className="text-[18px] font-extrabold">
                                {deal?.name || deal?.id}
                            </h3>
                        </div>
                    ))}
                </ScrollContainer>
            )}
        </>
    )
}

const DealsLoading = () => (
    <div className="w-full flex justify-center items-center bg-inherit m-2">
        <p>Loading...</p>
    </div>
)
export default DealsCarousel
