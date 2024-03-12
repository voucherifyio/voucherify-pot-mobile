'use client'
import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useState } from 'react'

interface Deals {
    id?: string
    title: string
    image?: string
    active: boolean
}

enum CurrentDeal {
    All = 'All',
    WithinReach = 'Within reach',
}
const Deals = () => {
    const deals: Deals[] = [
        {
            id: '001',
            title: 'Free package of bubble gum',
            image: require('../../../public/images/products/bubble-gum.png'),
            active: false,
        },
        { id: '002', title: 'Free coca-cola', image: '', active: true },
    ]

    const [currentDealType, setCurrentDealType] = useState<CurrentDeal>(
        CurrentDeal.WithinReach
    )
    return (
        <div className="bg-blue-background h-[90%] pt-2">
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
                        className={`ml-2 max-w-[150px] w-[150px] bg-white inline-block text-blue-text px-4 py-3 rounded-[30px] ${
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
                <div className="bg-blue-background mx-auto h-[80%] pt-2">
                    {deals.map((deal) => (
                        <div
                            key={deal.id}
                            className="shadow-md h-[120px] rounded-xl m-4 flex bg-white text-blue-text w-[90%]"
                        >
                            <div className="justify-between flex flex-col p-2 w-3/5">
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.title}
                                </h3>
                                <Button
                                    buttonType={
                                        deal.active ? 'activeCoupon' : 'yellow'
                                    }
                                    className="mt-2 max-h-[32px] max-w-[149px] text-[16px]"
                                >
                                    {deal.active
                                        ? '✓ Active coupon'
                                        : 'Activate coupon'}
                                </Button>
                            </div>

                            {deal.image && (
                                <div className="flex items-center ml-2 w-2/5">
                                    <Image
                                        src={deal.image}
                                        alt="rewardImage"
                                        width={120}
                                        height={100}
                                        className="max-w-[120px] max-h-[100px]"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {currentDealType === CurrentDeal.All && (
                <div className="bg-blue-background mx-auto h-[80%] pt-2"></div>
            )}
        </div>
    )
}

export default Deals
