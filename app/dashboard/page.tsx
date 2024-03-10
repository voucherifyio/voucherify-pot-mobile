'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '../ui/atoms/button'
import {
    InAppMessage,
    SlideUpMessage,
    automaticallyShowInAppMessages,
    showInAppMessage,
} from '@braze/web-sdk'
import { initalizeBraze } from '../braze/initialize-braze'

const Dashboard = () => {
    const router = useRouter()
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    if (status === 'loading') {
        return (
            <div className='flex items-center justify-center w-100 h-100'>
                <p>Loading...</p>
            </div>
        )
    }

    if (status === 'authenticated' && typeof window !== 'undefined') {
        initalizeBraze()
        automaticallyShowInAppMessages()
        const message = new SlideUpMessage('Hello User!')
        message.slideFrom = InAppMessage.SlideFrom.TOP
        message.dismissType = InAppMessage.DismissType.MANUAL
        showInAppMessage(message)
    }

    return (
        <div>
            <p>Hello User!</p>
            <Button
                onClick={() => signOut({ redirect: false })}
                buttonType="primary"
                className="px-4 py-2 w-full mb-1"
            >
                Logout
            </Button>
        </div>
    )
}

export default Dashboard
