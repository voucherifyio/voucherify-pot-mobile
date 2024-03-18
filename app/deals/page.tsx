'use client'
import JournieHeader from '@/app/components/journie-header/journie-header'
import Deals from '@/app/components/deals/deals'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'

export default function DealsPage() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const customerId = session?.user?.id

    if (status === 'loading') {
        return <Loading />
    }

    return (
        <div className="flex flex-col flex-1">
            <JournieHeader headerText={'JOURNIE Deals'} />
            {customerId && <Deals customerId={customerId} />}
        </div>
    )
}
