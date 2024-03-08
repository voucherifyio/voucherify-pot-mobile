import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    buttonType?: 'primary' | 'secondary' | 'yellow'
}

const Button = (props: ButtonProps) => {
    const { className, buttonType, ...buttonProps } = props

    const buttonStyles: Record<string, string> = {
        primary: 'bg-blue-text text-white',
        secondary: 'border bg-white border-blue-border text-blue-text',
        yellow: 'bg-yellow-button text-blue-text',
    }

    const buttonClassName = `${className} text-16 rounded-[5px] font-medium h-12 ${
        buttonType ? buttonStyles[buttonType] : ''
    }`

    return (
        <button {...buttonProps} className={buttonClassName}>
            {props.children}
        </button>
    )
}

export default Button
