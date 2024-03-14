'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useInitalizeBraze } from '../hooks/useInitializeBraze'
import Button from '@/app/components/ui/atoms/button'
import Loading from '../components/loading/loading'

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
        return <Loading />
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
