'use client'
import Button from '@/app/components/ui/atoms/button'
import { useSession, signIn, getSession } from 'next-auth/react'
import { useContext, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Loading from '../components/loading/loading'
import { MobileAppContext } from '../components/app-context/app-context'

export interface Inputs {
    phone: string
    password?: string
}

export default function LoginPage() {
    const [error, setError] = useState<string | undefined>(undefined)
    const form = useForm<Inputs>()
    const router = useRouter()
    const { status } = useSession()
    const [loading, setLoading] = useState(false)
    const { changeBrazeUser } = useContext(MobileAppContext)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/home')
        }
    }, [status, router])

    const inputStyle =
        'border-blue-inputOutlineDefault h-[44px] w-full rounded-md px-3 py-2 bg-blue-background'
    const labelStyle =
        'text-blue-formInput font-14 h-[16px] mb-2 block text-sm font-normal'

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true)
        const res = await signIn('credentials', {
            redirect: false,
            phone: data.phone,
        })

        if (res?.status !== 200) {
            setLoading(false)
            return setError(`Customer does not exist, please register.`)
        }

        if (res?.ok) {
            const session = await getSession()
            const customerId = session?.user?.id
            const brazeUser = await changeBrazeUser({ customerId })
            if (brazeUser === customerId) {
                router.push('/home')
            }
        }
    }

    const handleResetError = () => {
        if (error) {
            setError(undefined)
        }
    }

    const handleRegisterClick = () => {
        router.push('/register')
    }

    if (status === 'loading' || status === 'authenticated' || loading) {
        return <Loading />
    }

    return (
        <div className="h-screen items-center justify-center">
            <div className="border-bottom-gray-200 flex h-[25%] w-full flex-col items-center justify-center border-b bg-white">
                <h1 className="text-blue-text text-xl font-extrabold">
                    Login to your account
                </h1>
            </div>
            <div className="bg-blue-background flex py-10 max-h-full w-full flex-col items-center justify-center">
                <form
                    className="bg-blue-background mt-6 w-full rounded-md px-2"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-6">
                        <label htmlFor="phone" className={labelStyle}>
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className={inputStyle}
                            {...register('phone', {
                                required: 'Please fill in the phone number',
                                onChange: handleResetError,
                            })}
                        />
                        {errors.phone ? (
                            <p className="text-xs mt-1 text-red-500">
                                {errors.phone.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className={labelStyle}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={inputStyle}
                            {...register('password', {
                                required: false,
                                onChange: handleResetError,
                            })}
                        />
                    </div>
                    {error ? <p className="text-center mt-2">{error}</p> : null}
                    <Button
                        type="submit"
                        buttonType="primary"
                        className="px-4 py-2 w-full bg-green-500 mb-1"
                    >
                        Login
                    </Button>
                    <Button
                        type="button"
                        buttonType="primary"
                        className="px-4 py-2 w-full mb-1"
                        onClick={handleRegisterClick}
                    >
                        Register
                    </Button>
                </form>
                <div className="bg-blue-background min-h-[220px]" />
            </div>
        </div>
    )
}
