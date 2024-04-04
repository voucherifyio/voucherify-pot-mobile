'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import loginPage from '@/public/images/login-page.jpeg'
import Button from '@/app/components/ui/atoms/button'
import Loading from '@/app/components/loading/loading'
import { useEffect } from 'react'

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
    const handleLoginClick = () => {
        router.push('/login')
    }

    if (status === 'loading') {
        return <Loading />
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-blue-100">
            <Image
                src={loginPage}
                alt="login-page"
                priority
                className="object-cover object-right flex-1"
            />

            <div className="flex-1 max-h-60 mt-6 w-full max-w-screen-sm text-center">
                <h1 className="text-blue-text mb-6 px-5 text-left text-xl font-bold leading-7">
                    Register to Journie
                </h1>
                <Button
                    buttonType="secondary"
                    onClick={handleRegisterClick}
                    className="w-[94%] text-16 mb-2 px-5"
                >
                    Register
                </Button>
                <button className=" text-blue-text text-16 mx-10 mb-2 h-12 font-medium">
                    Already have an account
                </button>
                <Button
                    buttonType="primary"
                    onClick={handleLoginClick}
                    className="w-[94%]"
                >
                    Login
                </Button>
            </div>
        </div>
    )
}
