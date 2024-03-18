'use client'
import { MdOutlineAccountCircle } from 'react-icons/md'
import Button from '@/app/components/ui/atoms/button'
import Image from 'next/image'
import aeroplan from '@/public/images/aeroplan.png'
import Milestones from '@/app/components/milestones/milestones'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useInitalizeBraze } from '../hooks/useInitializeBraze'
import { signOut } from 'next-auth/react'
import BrazePermissionModal from '../components/braze-permission-modal/braze-permission-modal'
import DealsCarousel from '@/app/components/deals/deals-carousel'
import Loading from '../components/loading/loading'

export default function HomePage() {
    const router = useRouter()
    const { status, data } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const { braze } = useInitalizeBraze()

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
                    <Button onClick={() => signOut({ redirect: false })} className='bg-slate-300 h-auto py-1 px-2'>
                        Logout
                    </Button>
                </div>
            </div>
            <div className="flex-row  mx-border-b-2 w-full">
                {/*upselling*/}
                <Milestones />
                {/*main*/}
                <DealsCarousel />
                {/*partner hub*/}
                <div className="mx-4 text-blue-text text-18 font-bold flex justify-between mt-4">
                    <div className="flex-col">
                        <h1 className="mb-2 text-blue-text text-18 font-bold">
                            Partner Hub
                        </h1>
                        <h4 className="mb-4 text-blue-text text-14 font-normal">
                            Get linked. Get more.
                        </h4>
                        <Button buttonType="yellow" className="w-[140px] px-2">
                            Link to Aeroplan
                        </Button>
                    </div>
                    <Image
                        src={aeroplan}
                        alt="aeroplan"
                        className="h-[112px] w-[130px] object-cover object-right"
                    />
                </div>
            </div>
        </div>
    )
}
