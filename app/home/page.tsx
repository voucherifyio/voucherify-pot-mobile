'use client'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MdOutlineAccountCircle } from 'react-icons/md'
import Button from '@/app/components/ui/atoms/button'
import Milestones from '@/app/components/milestones/milestones'
import BrazePermissionModal from '@/app/components/braze-permission-modal/braze-permission-modal'
import DealsCarousel from '@/app/components/deals/deals-carousel'
import Aeroplan from '@/app/components/aeroplan/aeroplan'
import EarningRulesCarousel from '@/app/components/earning-rules/earning-rules-carousel'
import Loading from '@/app/components/loading/loading'
import { useContext } from 'react'
import { MobileAppContext } from '../components/app-context/app-context'

export default function HomePage() {
    const router = useRouter()
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const { setDealsAndRewards, setCurrentCustomer, braze } =
        useContext(MobileAppContext)

    const handleLocalStorage = () => {
        localStorage.setItem('dealsAndRewards', JSON.stringify([]))
        localStorage.setItem('activeDealsAndRewards', JSON.stringify([]))
    }

    if (status === 'loading') {
        return <Loading />
    }

    const showBrazePermissionModal = !braze?.isPushPermissionGranted()

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-[#ecf0fb] overflow-hidden">
            {showBrazePermissionModal && <BrazePermissionModal braze={braze} />}
            <div className="flex justify-between px-4 py-2 w-full bg-white">
                <div>
                    <h1 className="text-blue-text text-2xl font-extrabold">
                        My Voucherify
                    </h1>
                    <h4 className="text-blue-text text-[15px] font-normal">
                        Hello {session.user?.name || session.user?.id}
                    </h4>
                </div>
                <div className="flex items-center gap-2">
                    <MdOutlineAccountCircle size={24} color="blue" />
                    <Button
                        buttonType="primary"
                        onClick={() => {
                            signOut({ redirect: false })
                            setDealsAndRewards({ deals: 0, rewards: 0 })
                            setCurrentCustomer(undefined)
                            handleLocalStorage()
                        }}
                        className="h-auto py-1 px-2"
                    >
                        Logout
                    </Button>
                </div>
            </div>
            <div className="flex-1 flex flex-col w-full">
                <Milestones />
                <DealsCarousel />
                <EarningRulesCarousel />
                <Aeroplan />
            </div>
        </div>
    )
}
