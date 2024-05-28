'use client'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import ScrollContainer from 'react-indiana-drag-scroll'
import { MobileAppContext } from '../app-context/app-context'
import Button from '../ui/atoms/button'
import { useDeals } from '@/app/hooks/useDeals'
import { PulseLoader } from 'react-spinners'
import Loading from '../loading/loading'

const DealsCarousel = () => {
    const router = useRouter()
    const { customer } = useContext(MobileAppContext)
    const customerSourceId = customer?.source_id
    const { activeDeals, dealsLoading } = useDeals({
        customerSourceId,
    })

    const handleDealsRedirectClick = () => {
        router.push('/deals')
    }

    return (
        <>
            <div className="flex justify-between mx-5">
                <h1 className="text-blue-text text-18 font-bold">Deals</h1>
                {activeDeals.length === 0 ? null : (
                    <Button
                        onClick={handleDealsRedirectClick}
                        className="flex items-center h-[32px] text-[16px] font-normal text-blue-text px-4 rounded bg-blue-background border border-blue-activeCoupon"
                    >
                        See all
                        <span className="pl-2">
                            <FaArrowRight />
                        </span>
                    </Button>
                )}
            </div>
            {activeDeals?.length === 0 && !dealsLoading && (
                <div className="py-3 flex justify-center items-center">
                    <p className="text-[14px] font-bold text-blue-text">
                        No active deals
                    </p>
                </div>
            )}
            {dealsLoading ? (
                <Loading />
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
                            <h3 className="font-extrabold">
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
        <PulseLoader size={5} color="#173c9f" />
    </div>
)
export default DealsCarousel
