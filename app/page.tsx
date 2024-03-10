'use client'
import Image from 'next/image'
import loginPage from '../public/images/login-page.jpeg'
import { useRouter } from 'next/navigation'
import Button from '@/app/ui/atoms/button'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import {
    InAppMessage,
    SlideUpMessage,
    automaticallyShowInAppMessages,
    initialize,
    logCustomEvent,
    openSession,
    requestImmediateDataFlush,
    requestPushPermission,
    showInAppMessage,
    subscribeToInAppMessage,
} from '@braze/web-sdk'
import { initalizeBraze } from './braze/initialize-braze'

export default function LoginPage() {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            initalizeBraze()
            requestPushPermission(() => {
                logCustomEvent('Custom', {})
                requestImmediateDataFlush()
            })
        }
    }, [])

    const handleRegisterClick = () => {
        router.push('/register')
    }
    const handleLoginClick = () => {
        router.push('/login')
    }

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center w-100 h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    if (status === 'authenticated') {
        router.push('/dashboard')
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-blue-100">
            <Image
                src={loginPage}
                alt="login-page"
                className="h-[68%] w-[200%] object-cover object-right"
            />

            <div className="mt-6 h-[30%] w-full max-w-screen-sm text-center">
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
                {/*  should be a text */}
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
