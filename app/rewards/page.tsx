'use client'
import JournieHeader from '@/app/components/journie-header/journie-header'
import Rewards from '@/app/components/rewards/rewards'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function RewardsPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    useEffect(() => {
        if (status === 'loading') {
            return
        }

        if (!session || status !== 'authenticated') {
            router.push('/')
        }
    }, [session, status, router])
    return (
        <>
            {status === 'authenticated' && (
                <div className="h-screen items-center justify-center">
                    <JournieHeader headerText={'Journie REWARDS'} />
                    <Rewards />
                </div>
            )}
        </>
    )
}
