'use client'

import { useRouter } from 'next/navigation'
import EarnAndBurnRewards from '../components/earn-and-burn/earn-and-burn'
import VoucherifyHeader from '../components/voucherify-header/voucherify-header'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'

export default function EarnAndBurnRewardsPage() {
    const router = useRouter()
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    if (status === 'loading') {
        return <Loading />
    }

    return (
        <div className="bg-blue-background flex flex-col flex-1">
            <VoucherifyHeader headerText={'Earn and burn'} />
            <EarnAndBurnRewards />
        </div>
    )
}
