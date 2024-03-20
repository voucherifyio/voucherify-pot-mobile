import Button from '@/app/components/ui/atoms/button'
import Image from 'next/image'
import aeroplan from '@/public/images/aeroplan.png'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Toast from '@/app/components/ui/atoms/toast'

const Aeroplan = () => {
    const [isLinkedToAeroplan, setIsLinkedToAeroplan] = useState<boolean>()
    const { data: session } = useSession()
    const customerPhone = session?.user?.id
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<boolean>(false)

    const handleLinkToAeroplan = async () => {
        if (customerPhone) {
            try {
                await fetch(`/api/voucherify/update-customer`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        source_id: customerPhone,
                        metadata: { aeroplan_member: true },
                    }),
                })
                setSuccess(true)
            } catch (err: any) {
                console.error(err)
                setError(err)
            }
        }
    }

    useEffect(() => {
        const fetchCustomersAeroplanMetadata = async () => {
            if (customerPhone) {
                try {
                    const res = await fetch(
                        `/api/voucherify/get-customer?phone=${customerPhone}`,
                        {
                            method: 'GET',
                        }
                    )
                    const { customer } = await res.json()
                    if (customer.metadata?.aeroplan_member === true) {
                        setIsLinkedToAeroplan(
                            customer.metadata?.aeroplan_member
                        )
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message)
                    }
                    return err
                }
            }
        }
        fetchCustomersAeroplanMetadata().catch(console.error)
    }, [handleLinkToAeroplan])

    return (
        <div className="bottom-20 mx-4 text-blue-text text-18 font-bold flex justify-between mt-40">
            <div className="flex-col">
                <h1 className="mb-2 text-blue-text text-18 font-bold">
                    Partner Hub
                </h1>
                {!isLinkedToAeroplan && (
                    <h4 className="mb-4 text-blue-text text-14 font-normal">
                        Get linked. Get more.
                    </h4>
                )}
                {isLinkedToAeroplan && (
                    <h4 className="px-3 font-normal mt-5">
                        Your account is already connected to Aeroplan.
                    </h4>
                )}
                {!isLinkedToAeroplan && (
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
