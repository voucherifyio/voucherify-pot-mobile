'use client'
import VoucherifyHeader from '@/app/components/voucherify-header/voucherify-header'
import Rewards from '@/app/components/rewards/rewards'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loading from '../components/loading/loading'

export default function RewardsPage() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })
    const customerId = session?.user?.id

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
