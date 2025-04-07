import Image from 'next/image'
import { useLoyaltyCard } from '@/app/hooks/useLoyaltyCard'
import LoyaltyCardImage from '@/public/images/volkswagen/loyalty-card-image.png'

interface LoyaltyCardProps {
    customerId: string
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ customerId }) => {
    const { cardUrl, error } = useLoyaltyCard({ customerId })
console.log('halo', customerId)
    return (
        <>
            {cardUrl && !error && (
                <div>
                    <Image src={LoyaltyCardImage} alt='' className='rounded-t-[8px]' />
                    <Image
                        src={cardUrl}
                        alt="loyaltyCardBarCode"
                        width={390}
                        height={106}
                        className="max-w-auto rounded-b-[8px]"
                        />
                </div>
            )}
            {error && (
                <p className="text-red-500 font-extrabold">
                    Barcode is not available.
                </p>
            )}
        </>
    )
}

export default LoyaltyCard
