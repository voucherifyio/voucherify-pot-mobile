'use client'
import Image from 'next/image'
import Button from '@/app/components/ui/atoms/button'
import { useState } from 'react'

interface Deals {
    id?: string
    title: string
    active: boolean
    available: boolean
    eligibilityCondition?: string
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
            active: false,
            available: true,
        },
        { id: '002', title: 'Free coca-cola', active: true, available: true },
        {
            id: '003',
            title: 'Free 6-pack of coca-cola',
            active: false,
            available: false,
            eligibilityCondition: 'pump in 3 different location',
        },
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
                <div className="bg-blue-background mx-auto h-[80%] pt-2">
                    {deals
                        .filter((deal) => deal.available)
                        .map((deal) => (
                            <div
                                key={deal.id}
                                className="shadow-md h-[92px] rounded-xl m-4 flex bg-white text-blue-text w-[90%]"
                            >
                                <div className="flex flex-col p-2">
                                    <h3 className="text-[18px] font-extrabold">
                                        {deal?.title}
                                    </h3>
                                    <Button
                                        buttonType={
                                            deal.active
                                                ? 'activeCoupon'
                                                : 'yellow'
                                        }
                                        className="mt-2 px-2 max-h-[32px] max-w-[149px] text-[16px]"
                                    >
                                        {deal.active
                                            ? '✓ Active coupon'
                                            : 'Activate coupon'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            )}
            {currentDealType === CurrentDeal.All && (
                <div className="bg-blue-background mx-auto h-[80%] pt-2">
                    {deals.map((deal) => (
                        <div
                            key={deal.id}
                            className="shadow-md h-[92px] rounded-xl m-4 flex bg-white text-blue-text w-[90%]"
                        >
                            <div className="flex flex-col p-2">
                                <h3 className="text-[18px] font-extrabold">
                                    {deal?.title}
                                </h3>
                                {deal.available ? (
                                    <Button
                                        buttonType={
                                            deal.active
                                                ? 'activeCoupon'
                                                : 'yellow'
                                        }
                                        className="mt-2 px-2 max-h-[32px] max-w-[149px] text-[16px]"
                                    >
                                        {deal.active
                                            ? '✓ Active coupon'
                                            : 'Activate coupon'}
                                    </Button>
                                ) : (
                                    <p>{deal?.eligibilityCondition}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Deals
