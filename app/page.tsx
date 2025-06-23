'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import welcomeImage from '@/public/images/oreilly-home.png'
import Button from '@/app/components/ui/atoms/button'
import Loading from '@/app/components/loading/loading'
import { useEffect } from 'react'
import Link from 'next/link'
import { APP_DETAILS } from '../enum/app-details'

export default function LoginPage() {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/home')
        }
    }, [status, router])

    const handleRegisterClick = () => {
        router.push('/register')
    }

    if (status === 'loading') {
        return <Loading />
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Image
                src={welcomeImage}
                alt="Welcome page"
                priority
            />

            <div className="flex-1 flex flex-col gap-4 max-h-60 w-full max-w-screen-sm text-center justify-center items-center">
                <h1 className="text-black-text px-5 text-xl font-bold leading-7 text-center">
                    {APP_DETAILS.login_welcome_title}
                </h1>
                <Button
                    buttonType="primary"
                    onClick={handleRegisterClick}
                    className="w-[94%] text-16 px-5 rounded-[50px]"
                >
                    Register
                </Button>
                <div className="flex justify-center gap-x-2">
                    <p className="text-16">Already have an account?</p>
                    <Link href="/login" className="text-blue-text">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}
