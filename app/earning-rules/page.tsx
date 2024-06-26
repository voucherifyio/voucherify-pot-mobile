'use client'
import VoucherifyHeader from '@/app/components/voucherify-header/voucherify-header'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'
import EarningRules from '@/app/components/earning-rules/earning-rules'

export default function EarningRulesPage() {
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
        <div className="flex flex-col flex-1 bg-blue-background">
            <VoucherifyHeader headerText={'Earning Rules'} />
            {customerId && <EarningRules customerId={customerId} />}
        </div>
    )
}
