'use client'
import Button from '@/app/components/ui/atoms/button'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors },
    } = useForm()
    const inputStyle =
        'border-blue-inputOutlineDefault h-[44px] w-full rounded-md px-3 py-2 bg-blue-background'
    const labelStyle =
        'text-blue-formInput font-14 h-[16px] mb-2 block text-sm font-normal'

    //add type below
    const onFormSubmit = (formData: any) => {
        console.log(formData)
    }

    return (
        <div className="h-screen items-center justify-center">
            <div className="border-bottom-gray-200 flex h-[25%] w-full flex-col items-center justify-center border-b bg-white">
                <h1 className="text-blue-text  text-xl font-extrabold">
                    Create your account
                </h1>
                <h4 className="text-blue-text">to start earning rewards</h4>
            </div>
            <div className="bg-blue-background flex h-[75%] max-h-full w-full flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="bg-blue-background mt-6 h-[100%] w-full rounded-md px-2 shadow-md"
                >
                    <div className="mb-6">
                        <label htmlFor="firstName" className={labelStyle}>
                            First name
                        </label>
                        <input
                            {...register('firstName')}
                            type="text"
                            id="firstName"
                            name="firstName"
                            // value={formData.firstName}
                            className={inputStyle}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="lastName" className={labelStyle}>
                            Last name
                        </label>
                        <input
                            {...register('lastName')}
                            type="text"
                            id="lastName"
                            name="lastName"
                            // value={formData.lastName}
                            className={inputStyle}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phoneNumber" className={labelStyle}>
                            Phone number
                        </label>
                        <input
                            {...register('phoneNumber')}
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            // value={formData.phoneNumber}
                            className={inputStyle}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className={labelStyle}>
                            E-mail
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            id="email"
                            name="email"
                            // value={formData.email}
                            className={inputStyle}
                            required
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
                            // value={formData.email}
                            className={inputStyle}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className={labelStyle}>
                            Password
                        </label>
                        <input
                            {...register('password', {
                                required: true,
                            })}
                            type="password"
                            id="password"
                            name="password"
                            // value={formData.password}
                            className={inputStyle}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="repeatPassword" className={labelStyle}>
                            Repeat password
                        </label>
                        <input
                            {...register('confirmPassword', {
                                required: true,
                                validate: (value: string) => {
                                    if (watch('password') !== value) {
                                        return 'Your passwords do no match'
                                    }
                                },
                            })}
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            // value={formData.repeatPassword}
                            className={inputStyle}
                            required
                        />
                    </div>
                    <Button
                        buttonType="primary"
                        type="submit"
                        className="px-4 py-2 w-full"
                        // onClick={handleSubmit}
                    >
                        Register
                    </Button>
                </form>
            </div>
        </div>
    )
}
