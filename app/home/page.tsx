'use client'
import { MdOutlineAccountCircle } from 'react-icons/md'
import Button from '@/app/components/ui/atoms/button'
import Image from 'next/image'
import aeroplan from '@/public/images/aeroplan.png'
import Milestones from '@/app/components/milestones/milestones'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useInitalizeBraze } from '../hooks/useInitializeBraze'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import BrazePermissionModal from '../components/braze-permission-modal/braze-permission-modal'
import DealsCarousel from '@/app/components/deals/deals-carousel'

export default function HomePage() {
    const router = useRouter()
    const { status, data } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/')
        },
    })
    const { braze } = useInitalizeBraze()
    const [error, setError] = useState<string | undefined>(undefined)

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center w-100 h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="h-screen items-center justify-center">
            {data.user?.id && !braze?.isPushPermissionGranted() ? (
                <BrazePermissionModal braze={braze} />
            ) : null}
            <div className="flex mt-4 px-4 border-b-2 h-[8%] w-full bg-white">
                <div className="w-[80%]">
                    <h1 className="text-blue-text text-2xl font-extrabold">
                        My Journie
                    </h1>
                    <h4 className="text-blue-text text-[15px] font-normal">
                        Hello {data.user?.name || 'User'}!
                    </h4>
                </div>
                <div className="w-[20%] h-[70px] self-center pt-4 pl-10">
                    <MdOutlineAccountCircle size={24} color="blue" />
                </div>
                <Button onClick={() => signOut({ redirect: false })}>
                    Logout
                </Button>
            </div>
            <div className="flex-row  mx-border-b-2 h-[100%] w-full bg-blue-background">
                {/*upselling*/}
                <div className="h-[15%] bg-blue-background w-full">
                    <Milestones userPhone={data.user?.id} setError={setError} />
                </div>
                {/*main*/}
                <div className="h-[50%] w-full">
                    <DealsCarousel />
                </div>
                {/*partner hub*/}
                <div className="h-[20%] mx-4 text-blue-text text-18 font-bold flex justify-between">
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
