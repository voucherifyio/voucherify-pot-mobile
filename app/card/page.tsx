'use client'
import ActiveRewards from '@/app/components/active-rewards'
import JournieHeader from '@/app/components/journie-header/journie-header'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import LoyaltyCard from '@/app/components/loyalty-card/loyalty-card'

export default function CardPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const customerId = session?.user?.id

    useEffect(() => {
        if (status === 'loading') {
            return
        }
        if (!session || status !== 'authenticated') {
            router.push('/')
        }
    }, [status, router, session])

    return (
        <>
            {status === 'authenticated' && (
                <div className="h-screen items-center justify-center">
                    <JournieHeader headerText={'My JOURNIE Card'} />
                    <div className="flex-row p-4 h-[100%] w-full bg-blue-background">
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
                </div>
            )}
        </>
    )
}
