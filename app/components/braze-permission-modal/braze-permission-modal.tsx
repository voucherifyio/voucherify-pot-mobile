import { FC, useState } from 'react'
import Button from '../ui/atoms/button'
import { useSession } from 'next-auth/react'

type BrazePermissionModalProps = {
    braze:
        | typeof import('/Users/patryk.smolarz/Desktop/Patryk/parkland-mobile/node_modules/@braze/web-sdk/index')
        | undefined
}

const BrazePermissionModal: FC<BrazePermissionModalProps> = ({ braze }) => {
    const { data } = useSession()
    const [modal, setModal] = useState(true)

    return (
        <div
            className={`w-300 h-300 fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-cyan-800 p-10 ${modal ? 'block' : 'hidden'}`}
        >
            <p className="text-white">Allow Braze to send you notifications?</p>
            <div className="flex justify-evenly items-center mt-4">
                <Button
                    className="text-white bg-slate-400 h-auto px-4 py-1"
                    onClick={() => {
                        braze?.changeUser(data?.user?.id!)
                        braze?.requestPushPermission()
                        braze?.openSession()
                        setModal(false)
                    }}
                >
                    Allow
                </Button>
                <Button
                    className="text-white bg-slate-400 h-auto px-4 py-1"
                    onClick={() => setModal(false)}
                >
                    Don't allow
                </Button>
            </div>
        </div>
    )
}

export default BrazePermissionModal
