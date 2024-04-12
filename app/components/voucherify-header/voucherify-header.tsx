'use client'
import { useRouter } from 'next/navigation'
import { IoMdArrowBack } from 'react-icons/io'
import Button from '@/app/components/ui/atoms/button'

interface VoucherifyHeaderProps {
    headerText: string
}
const VoucherifyHeader: React.FC<VoucherifyHeaderProps> = ({ headerText }) => {
    const router = useRouter()
    const handleGoToPreviousPageClick = () => {
        router.push('/home')
    }
    return (
        <div className="flex px-4 border-b w-full bg-white">
            <div className="w-full flex flex items-center">
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

export default VoucherifyHeader
