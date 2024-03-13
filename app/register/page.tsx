'use client'
import Button from '@/app/components/ui/atoms/button'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { signOut } from 'next-auth/react'

type Inputs = {
    firstName?: string
    lastName?: string
    phone: string
    password?: string
    postalCode?: string
}

type RegisteredCustomer = {
    source_id: string
}

export default function RegisterPage() {
    const [error, setError] = useState<undefined | string>(undefined)
    const { status } = useSession()
    const [loading, setLoading] = useState(false)
    const form = useForm<Inputs>()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form
    const router = useRouter()

    const registerCustomer = async (values: Inputs) => {
        try {
            const res = await fetch(`/api/registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values }),
            })
            const data = await res.json()

            if (res.status === 400) {
                return setError(data.error)
            }
            return data
        } catch (err) {
            if (err instanceof Error) {
                return setError(err.message)
            }
            return err
        }
    }

    const onSubmit: SubmitHandler<Inputs> = async (values) => {
        setLoading(true)
        const registeredCustomer: RegisteredCustomer =
            await registerCustomer(values)

        if (registeredCustomer?.source_id) {
            try {
                const res = await signIn('login-after-registration', {
                    redirect: false,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phone: values.phone,
                })

                if (res?.status !== 200 || res.error || !res.ok) {
                    return setError('ERRRR')
                }

                router.push('/home')
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
                return err
            }
        }
        setLoading(false)
    }

    const handleLoginClick = () => {
        router.push('/login')
    }

    const inputStyle =
        'border-blue-inputOutlineDefault h-[44px] w-full rounded-md px-3 py-2 bg-blue-background'
    const labelStyle =
        'text-blue-formInput font-14 h-[16px] mb-2 block text-sm font-normal'

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center w-100 h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    if (status === 'authenticated') {
        return (
            <div>
                <p>You are logged in, logout first.</p>
                <Button
                    onClick={() => signOut()}
                    buttonType="primary"
                    className="px-4 py-2 w-full mb-1"
                >
                    Logout
                </Button>
            </div>
        )
    }

    return (
        <div className="h-screen items-center justify-center">
            <div className="border-bottom-gray-200 flex h-[15%] w-full flex-col items-center justify-center border-b bg-white">
                <h1 className="text-blue-text  text-xl font-extrabold">
                    Create your account
                </h1>
                <h4 className="text-blue-text">to start earning rewards</h4>
            </div>
            <div className="bg-blue-background flex h-[85%] max-h-full w-full flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-blue-background mt-6 h-[100%] w-full rounded-md px-2 shadow-md"
                >
                    <div className="mb-6">
                        <label htmlFor="firstName" className={labelStyle}>
                            First name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className={inputStyle}
                            {...register('firstName')}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="lastName" className={labelStyle}>
                            Last name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className={inputStyle}
                            {...register('lastName')}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phone" className={labelStyle}>
                            Phone number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            className={inputStyle}
                            {...register('phone', {
                                required: 'Please fill the phone number',
                            })}
                        />
                        {errors.phone ? (
                            <p className="text-xs mt-1 text-red-500">
                                {errors.phone.message}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className={labelStyle}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={inputStyle}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="postalCode" className={labelStyle}>
                            Postal code
                        </label>
                        <input
                            {...register('postalCode')}
                            id="postalCode"
                            name="postalCode"
                            type="text"
                            className={inputStyle}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className={labelStyle}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={inputStyle}
                            {...register('password')}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="repeatPassword" className={labelStyle}>
                            Repeat password
                        </label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            className={inputStyle}
                        />
                    </div>
                    {error ? <p className="text-center mt-2">{error}</p> : null}
                    <Button
                        buttonType="primary"
                        type="submit"
                        className="px-4 py-2 w-full mb-1"
                    >
                        Register
                    </Button>
                    <Button
                        buttonType="primary"
                        onClick={handleLoginClick}
                        className="px-4 py-2 w-full bg-green-500"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    )
}
