'use client'

import { useRouter } from 'next/navigation'
import EarnAndBurnRewards from '../components/earn-and-burn/earn-and-burn'
import VoucherifyHeader from '../components/voucherify-header/voucherify-header'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'
import { V_COLOR } from '../../enum/v-colors'

export default function EarnAndBurnRewardsPage() {
    const router = useRouter()
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    if (status === 'loading') {
        return <Loading className="text-white" />
    }

    return (
        <div
            className="flex flex-col flex-1"
            style={{ backgroundColor: V_COLOR.DARK_BLUE }}
        >
            <VoucherifyHeader headerText={'Burning Rewards'} />
            <EarnAndBurnRewards />
        </div>
    )
}
