import React, { ButtonHTMLAttributes, useEffect, useState } from 'react'
interface ToastProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    toastType: 'error' | 'success'
    toastText: string
}

const Toast = (props: ToastProps) => {
    const { className, toastText, toastType } = props
    const toastStyles: Record<string, string> = {
        error: 'text-red-500',
        success: 'text-green-600',
    }

    const toastClassName = `${className} font-bold border border-gray-300 rounded-lg shadow-lg fixed bottom-[10%] left-[10%] flex items-center w-full max-w-xs p-4  bg-white ${
        toastType ? toastStyles[toastType] : ''
    }`

    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        if (toastText && toastType) {
            setShowToast(true)

            const timer = setTimeout(() => {
                setShowToast(false)
            }, 4000)

            return () => clearTimeout(timer)
        }
    }, [toastText, toastType])

    return (
        <>
            {toastText && toastType && showToast && (
                <div id="toast-bottom" className={toastClassName}>
                    <div>{toastText}</div>
                </div>
            )}
        </>
    )
}

export default Toast
