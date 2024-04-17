import Button from '@/app/components/ui/atoms/button'
import { useContext, useState } from 'react'
import Toast from '@/app/components/ui/atoms/toast'
import { MobileAppContext } from '../app-context/app-context'
import { updateCustomer } from '@/app/apiEndpoints/apiEndpoints'

const VoucherifyPlan = () => {
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)
    const { customer, isLinkedToVoucherify } = useContext(MobileAppContext)
    const customerId = customer?.id

    const handleLinkToVoucherify = async () => {
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
        <div className="mx-5 text-blue-text text-18 font-bold flex justify-between py-2">
            <div className="flex-col">
                <h1 className="text-blue-text text-18 font-bold">
                    Voucherify Hub
                </h1>
                {!isLinkedToVoucherify && !loading && (
                    <h4 className="mb-2 text-blue-text text-14 font-normal">
                        Get linked. Get more.
                    </h4>
                )}
                {isLinkedToVoucherify && !loading && customer && (
                    <h4 className="font-normal mt-5">
                        Your account is already connected to Voucherify plan.
                    </h4>
                )}
                {!isLinkedToVoucherify && !loading && customer && (
                    <Button
                        onClick={handleLinkToVoucherify}
                        buttonType="green"
                        className="px-2"
                    >
                        Link to Voucherify plan
                    </Button>
                )}
            </div>
            {error && <Toast toastText={error} toastType="error" />}
            {success && (
                <Toast
                    toastText="Successfuly linked to Voucherify plan!"
                    toastType="success"
                />
            )}
        </div>
    )
}

export default VoucherifyPlan
