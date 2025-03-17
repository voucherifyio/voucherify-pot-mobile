import { FC } from "react"

type LoadingProps = {
    className?: string
}

const Loading: FC<LoadingProps> = ({ className }) => {
    return (
        <div className="flex items-center justify-center w-full h-screen bg-inherit">
            <p className={className}>Loading...</p>
        </div>
    )
}

export default Loading
