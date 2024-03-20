'use client'
import { FC, MutableRefObject, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import { useDealsCarousel } from '@/app/hooks/useDealsCarousel'
import ScrollContainer from 'react-indiana-drag-scroll'

type DealsCarouselProps = {
    customerId: string | null | undefined
}

const DealsCarousel: FC<DealsCarouselProps> = ({ customerId }) => {
    const router = useRouter()
    const { activeDeals, error } = useDealsCarousel({
        customerId,
    })

    const handleDealsRedirectClick = () => {
        router.push('/deals')
    }

    return (
        <>
            <div className="flex justify-between mx-8 h-[32px]">
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
            <ScrollContainer
                component={'div'}
                className="scroll-container flex ml-2 w-full"
                buttons={[1, 2, 3, 4]}
            >
                {activeDeals?.slice(0, 4)?.map((deal) => (
                    <div
                        key={deal.id}
                        className="shadow-md min-h-[60px] min-w-[70%] rounded-xl m-4 flex bg-white text-blue-text flex flex-col p-2"
                    >
                        <h3 className="text-[18px] font-extrabold">
                            {deal?.name || deal?.id}
                        </h3>
                    </div>
                ))}
            </ScrollContainer>
        </>
    )
}
export default DealsCarousel
