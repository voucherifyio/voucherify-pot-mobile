'use client'
import { IoMdArrowBack } from 'react-icons/io'
import Button from '@/app/components/ui/atoms/button'
import { useRouter } from 'next/navigation'

interface JournieHeaderProps {
    headerText: string
}
const JournieHeader: React.FC<JournieHeaderProps> = ({ headerText }) => {
    const router = useRouter()
    const handleGoToPreviousPageClick = () => {
        router.push('/home')
    }
    return (
        <div className="flex px-4 border-b h-[8%] w-full bg-white">
            <div className="w-full flex flex-row items-center">
                <div>
                    <Button onClick={handleGoToPreviousPageClick}>
                        <IoMdArrowBack size={20} color={'blue'} />
                    </Button>
                </div>
                <h1 className="text-center w-[100%] text-blue-text text-2xl font-extrabold">
                    {headerText}
                </h1>
            </div>
        </div>
    )
}

export default JournieHeader
