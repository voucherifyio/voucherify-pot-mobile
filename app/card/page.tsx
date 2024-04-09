'use client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ActiveRewards from '@/app/components/loyalty-card/active-rewards'
import JournieHeader from '@/app/components/journie-header/journie-header'
import LoyaltyCard from '@/app/components/loyalty-card/loyalty-card'
import Loading from '@/app/components/loading/loading'
import { useContext } from 'react'
import { MobileAppContext } from '../components/app-context/app-context'

export default function CardPage() {
    const router = useRouter()
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const { customer } = useContext(MobileAppContext)
    const customerId = customer?.id

    if (status === 'loading') {
        return <Loading />
    }

    if (status === 'authenticated') {
        return (
            <div className="flex-1 bg-blue-background">
                <JournieHeader headerText={'Loyalty card'} />
                {customer ? (
                    <div className="p-4 w-full">
                        <header>
                            <h1 className="mb-4 text-[18px] font-bold text-blue-text">
                                Scan in-store
                            </h1>
                            <h4 className="text-16 font-normal text-blue-text mb-4">
                                Show this card when you pay in-store to earn
                                points and redeem rewards.
                            </h4>
                        </header>
                        {customerId && <LoyaltyCard customerId={customerId} />}
                        <ActiveRewards />
                    </div>
                ) : (
                    <p className="mt-10 ml-[80px] text-[14px] font-bold text-blue-text">
                        You loyalty card is not ready.
                    </p>
                )}
            </div>
        )
    }
}
