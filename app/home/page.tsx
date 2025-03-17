'use client'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MdOutlineAccountCircle } from 'react-icons/md'
import Button from '@/app/components/ui/atoms/button'
import Milestones from '@/app/components/milestones/milestones'
import BrazePermissionModal from '@/app/components/braze-permission-modal/braze-permission-modal'
import Loading from '@/app/components/loading/loading'
import { useContext } from 'react'
import { MobileAppContext } from '../components/app-context/app-context'
import Resources from '../components/resources/resources'

export default function HomePage() {
    const router = useRouter()
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const {
        setDealsAndRewards,
        setCurrentCustomer,
        loyaltyCampaignName,
        braze,
    } = useContext(MobileAppContext)

    const handleLocalStorage = () => {
        localStorage.setItem('dealsAndRewards', JSON.stringify([]))
        localStorage.setItem('activeDealsAndRewards', JSON.stringify([]))
    }

    if (status === 'loading') {
        return <Loading />
    }

    const showBrazePermissionModal = !braze?.isPushPermissionGranted()

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {showBrazePermissionModal && <BrazePermissionModal braze={braze} />}
            <div className="flex justify-between px-4 py-2 w-full bg-white items-center">
                    <h4 className="text-[15px] font-normal">
                        Hello {session.user?.name || session.user?.id}
                    </h4>
                <div className="flex items-center gap-2">
                    <MdOutlineAccountCircle size={24} color="black" />
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
                <Resources />
            </div>
        </div>
    )
}
