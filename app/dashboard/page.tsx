'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useInitalizeBraze } from '../hooks/initializeBraze'
import Button from '@/app/components/ui/atoms/button'

const Dashboard = () => {
    const { braze } = useInitalizeBraze()
    const router = useRouter()
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/login')
        },
    })

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center w-100 h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen gap-4">
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
