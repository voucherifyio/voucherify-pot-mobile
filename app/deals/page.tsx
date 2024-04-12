'use client'
import JournieHeader from '@/app/components/journie-header/journie-header'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '@/app/components/loading/loading'
import Deals from '@/app/components/deals/deals'

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
        <div className="bg-blue-background flex flex-col flex-1">
            <JournieHeader headerText={'Deals'} />
            <Deals />
        </div>
    )
}
