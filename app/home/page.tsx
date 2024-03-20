'use client'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MdOutlineAccountCircle } from 'react-icons/md'
import { useInitalizeBraze } from '@/app/hooks/useInitializeBraze'
import Button from '@/app/components/ui/atoms/button'
import Milestones from '@/app/components/milestones/milestones'
import BrazePermissionModal from '@/app/components/braze-permission-modal/braze-permission-modal'
import DealsCarousel from '@/app/components/deals/deals-carousel'
import Aeroplan from '@/app/components/aeroplan/aeroplan'
import EarningRulesCarousel from '@/app/components/earning-rules/earning-rules-carousel'
import Loading from '@/app/components/loading/loading'

export default function HomePage() {
    const router = useRouter()
    const { status, data } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const { braze } = useInitalizeBraze()

    const handleLocalStorage = () => {
        localStorage.setItem('dealsAndRewards', JSON.stringify([]))
        localStorage.setItem('activeDealsAndRewards', JSON.stringify([]))
    }

    if (status === 'loading') {
        return <Loading />
    }

    return (
        <div className="flex-1 items-center justify-center bg-[#ecf0fb]">
            {(data.user?.id && !braze?.isPushPermissionGranted()) ||
            data.user?.id !== braze?.getUser()?.getUserId() ? (
                <BrazePermissionModal braze={braze} />
            ) : null}
            <div className="flex justify-between px-4 py-2 border-b-2 w-full bg-white">
                <div>
                    <h1 className="text-blue-text text-2xl font-extrabold">
                        My Journie
                    </h1>
                    <h4 className="text-blue-text text-[15px] font-normal">
                        Hello {data.user?.name || 'User'}!
                    </h4>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineAccountCircle size={24} color="blue" />
                    <Button
                        onClick={() => {
                            signOut({ redirect: false })
                            handleLocalStorage()
                        }}
                        className="bg-slate-300 h-auto py-1 px-2"
                    >
                        Logout
                    </Button>
                </div>
            </div>
            <div className="flex-row  mx-border-b-2 w-full">
                <Milestones />
                <DealsCarousel customerId={data.user?.id} />
                <EarningRulesCarousel />
                <Aeroplan />
            </div>
        </div>
    )
}
