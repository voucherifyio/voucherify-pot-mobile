import { FC } from 'react'
import Button from '../ui/atoms/button'

type GlobalErrorProps = {
    message: string
    buttonStyles?: string | undefined
    messageStyles?: string | undefined
}

const GlobalError: FC<GlobalErrorProps> = ({
    message,
    buttonStyles,
    messageStyles,
}) => {
    const buttonClassName = buttonStyles ? buttonStyles : 'px-4 h-10'

    const messageClassName = messageStyles
        ? messageStyles
        : 'text-center font-medium'

    return (
        <div className="flex flex-col w-full items-center justify-center p-5 gap-8">
            <p className={messageClassName}>{message}</p>
            <Button
                buttonType="primary"
                className={buttonClassName}
                onClick={() => window.location.reload()}
            >
                Refresh
            </Button>
        </div>
    )
}

export default GlobalError
