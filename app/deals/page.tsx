'use client'
import VoucherifyHeader from '@/app/components/voucherify-header/voucherify-header'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '@/app/components/loading/loading'
import Deals from '@/app/components/deals/deals'
import { V_COLOR } from '../../enum/v-colors'

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
        <div
            className="flex flex-col flex-1"
            style={{ backgroundColor: V_COLOR.DARK_BLUE }}
        >
            <VoucherifyHeader headerText={'Deals'} />
            <Deals />
        </div>
    )
}
