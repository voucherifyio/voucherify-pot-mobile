import Button from '@/app/components/ui/atoms/button'
import Image from 'next/image'
import aeroplan from '@/public/images/aeroplan.png'
import { useContext, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'
import { updateCustomer } from '@/app/apiEndpoints/apiEndpoints'

const Aeroplan = () => {
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const { customer, isLinkedToAeroplan } = useContext(MobileAppContext)
    const customerId = customer?.id

    const handleLinkToAeroplan = async () => {
        if (customerId) {
            try {
                await updateCustomer(customerId, true)
                setSuccess(true)
                setLoading(false)
            } catch (err: any) {
                console.error(err)
                setError(err)
            }
        }
    }

    return (
        <div className="mx-4 text-blue-text text-18 font-bold flex justify-between py-2">
            <div className="flex-col">
                <h1 className="mb-2 text-blue-text text-18 font-bold">
                    Partner Hub
                </h1>
                {!isLinkedToAeroplan && !loading && (
                    <h4 className="mb-4 text-blue-text text-14 font-normal">
                        Get linked. Get more.
                    </h4>
                )}
                {isLinkedToAeroplan && !loading && customer && (
                    <h4 className="px-3 font-normal mt-5">
                        Your account is already connected to Aeroplan.
                    </h4>
                )}
                {!isLinkedToAeroplan && !loading && customer && (
                    <Button
                        onClick={handleLinkToAeroplan}
                        buttonType="yellow"
                        className="w-[140px] px-2"
                    >
                        Link to Aeroplan
                    </Button>
                )}
            </div>

            <Image
                src={aeroplan}
                alt="aeroplan"
                className="h-[112px] w-[130px] object-cover object-right"
            />
            {error && <Toast toastText={error} toastType="error" />}
            {success && (
                <Toast
                    toastText="Successfuly linked to Aeroplan!"
                    toastType="success"
                />
            )}
        </div>
    )
}

export default Aeroplan
