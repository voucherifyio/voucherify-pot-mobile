'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import loginPage from '@/public/images/volkswagen/vw-hero-image.png'
import Button from '@/app/components/ui/atoms/button'
import Loading from '@/app/components/loading/loading'
import { useEffect } from 'react'
import Link from 'next/link'

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
        <div className="flex-1 flex flex-col items-center justify-center">
            <Image
                src={loginPage}
                alt="login-page"
                priority
                className="object-cover object-right flex-1"
            />

            <div className="flex-1 flex flex-col gap-4 max-h-60 w-full max-w-screen-sm text-center justify-center items-center">
                <h1 className="text-black-text px-5 text-left text-xl font-bold leading-7 text-center">
                    Register to Voucherify Mobile
                </h1>
                <Button
                    buttonType="primary"
                    onClick={handleRegisterClick}
                    className="w-[94%] text-16 px-5 rounded-[50px]"
                >
                    Register
                </Button>
                <div className='flex justify-center gap-x-2'>
                    <p className="text-16">
                        Already have an account?
                    </p>
                    <Link href="/login" className='text-blue-text'>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}
