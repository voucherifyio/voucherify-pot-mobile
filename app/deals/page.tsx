'use client'
import JournieHeader from '@/app/components/journie-header/journie-header'
import Deals from '@/app/components/deals/deals'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function DealsPage() {
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
    }, [session, status, router])
    return (
        <>
            {status === 'authenticated' && (
                <div className="h-screen items-center justify-center">
                    <JournieHeader headerText={'JOURNIE Deals'} />
                    {customerId && <Deals customerId={customerId} />}
                </div>
            )}
        </>
    )
}
