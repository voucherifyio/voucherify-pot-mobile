'use client'

import { useRouter } from 'next/navigation'
import EarnAndBurnRewards from '../components/earn-and-burn/earn-and-burn'
import VoucherifyHeader from '../components/voucherify-header/voucherify-header'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'
import { useContext, useEffect } from 'react'
import { MobileAppContext } from '../components/app-context/app-context'
import { CAMPAIGNS } from '@/enum/campaigns'

export default function EarnAndBurnRewardsPage() {
    const router = useRouter()
    const { loyaltyCampaignName } = useContext(MobileAppContext)
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    useEffect(() => {
        if (loyaltyCampaignName !== CAMPAIGNS.LOYALTY_PROGRAM_EARN_AND_BURN) {
            router.push('/home')
        }
    }, [loyaltyCampaignName])

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
