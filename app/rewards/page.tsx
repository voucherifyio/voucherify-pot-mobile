'use client'
import VoucherifyHeader from '@/app/components/voucherify-header/voucherify-header'
import Rewards from '@/app/components/rewards/rewards'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'
import { useContext, useEffect } from 'react'
import { MobileAppContext } from '../components/app-context/app-context'
import { CAMPAIGNS } from '@/enum/campaigns'

export default function RewardsPage() {
    const router = useRouter()
    const { loyaltyCampaignName } = useContext(MobileAppContext)
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })
    const customerId = session?.user?.id

    useEffect(() => {
        if (loyaltyCampaignName !== CAMPAIGNS.LOYALTY_PROGRAM) {
            router.push('/home')
        }
    }, [loyaltyCampaignName])

    if (status === 'loading') {
        return <Loading />
    }

    if (status === 'authenticated') {
        return (
            <div className="flex-1 flex flex-col bg-[#ecf0fb]">
                <VoucherifyHeader headerText={'Rewards'} />
                <Rewards customerId={customerId} />
            </div>
        )
    }
}
