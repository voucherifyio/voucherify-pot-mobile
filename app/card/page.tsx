import { IoMdArrowBack } from 'react-icons/io'
import Image from 'next/image'
import loyaltyCardBarCode from '@/public/images/loyalty-card.png'
import Button from '@/app/components/ui/atoms/button'
import ActiveRewards from '@/app/components/active-rewards'

export default function CardPage() {
    return (
        <div className="h-screen items-center justify-center">
            {/*header*/}
            <div className="flex px-4 border-b-2 h-[8%] w-full bg-white">
                <div className="w-[80%] flex flex-row items-center">
                    <div className="w-[20%]">
                        <IoMdArrowBack size={20} color={'blue'} />
                    </div>
                    <h1 className="text-blue-text text-2xl font-extrabold">
                        My Journie Card
                    </h1>
                </div>
            </div>
            <div className="flex-row p-4 h-[100%] w-full bg-blue-background">
                {/*	Card*/}
                <header>
                    <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                        Scan in-store
                    </h1>
                    <h4 className="text-16 font-normal text-blue-text mb-4">
                        Show this card when you pay in-store to earn points and
                        redeem rewards.
                    </h4>
                </header>
                {/*todo change this to real loyalty card bar code fetched from V%*/}
                <Image
                    src={loyaltyCardBarCode}
                    alt="loyaltyCardBarCode"
                    width={390}
                    height={106}
                    className="max-w-auto"
                />
                <Button className="w-full my-4 bg-blue-background border border-blue-inputOutlineDefault">
                    Copy number
                </Button>
                <ActiveRewards />
            </div>
        </div>
    )
}
