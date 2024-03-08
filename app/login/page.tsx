'use client'

import Button from '@/components/ui/atoms/button'

export default function LoginPage() {
    const inputStyle =
        'border-blue-inputOutlineDefault h-[44px] w-full rounded-md px-3 py-2 bg-blue-background'
    const labelStyle =
        'text-blue-formInput font-14 h-[16px] mb-2 block text-sm font-normal'
    return (
        <div className="h-screen items-center justify-center">
            <div className="border-bottom-gray-200 flex h-[25%] w-full flex-col items-center justify-center border-b bg-white">
                <h1 className="text-blue-text text-xl font-extrabold">
                    Login to your account
                </h1>
            </div>
            <div className="bg-blue-background flex py-10 max-h-full w-full flex-col items-center justify-center">
                <form className="bg-blue-background mt-6 w-full rounded-md px-2 shadow-md">
                    <div className="mb-6">
                        <label htmlFor="email" className={labelStyle}>
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
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
                            type="password"
                            id="password"
                            name="password"
                            // value={formData.password}
                            className={inputStyle}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        buttonType="primary"
                        className="w-full"
                        // onClick={handleSubmit}
                    >
                        Login
                    </Button>
                </form>
                <div className="bg-blue-background min-h-[220px]" />
            </div>
        </div>
    )
}
