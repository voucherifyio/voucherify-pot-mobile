'use client'
import { useRouter } from 'next/navigation'
import LeftArrowIcon from '@/public/images/volkswagen/left-arrow.png'
import Button from '@/app/components/ui/atoms/button'
import Image from 'next/image'

interface VoucherifyHeaderProps {
    headerText: string
}
const VoucherifyHeader: React.FC<VoucherifyHeaderProps> = ({ headerText }) => {
    const router = useRouter()
    const handleGoToPreviousPageClick = () => {
        router.push('/home')
    }
    return (
        <div className="flex items-center px-4 py-2 w-full bg-white">
            <Button onClick={handleGoToPreviousPageClick}>
                <Image src={LeftArrowIcon} alt='Back' />
            </Button>
            <h1 className="text-center w-[100%] text-2xl font-extrabold">
                {headerText}
            </h1>
        </div>
    )
}

export default VoucherifyHeader
