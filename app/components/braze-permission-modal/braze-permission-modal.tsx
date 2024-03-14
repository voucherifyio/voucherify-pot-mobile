import { FC, useState } from 'react'
import Button from '../ui/atoms/button'

type BrazePermissionModalProps = {
    braze:
        | typeof import('/Users/patryk.smolarz/Desktop/Patryk/parkland-mobile/node_modules/@braze/web-sdk/index')
        | undefined
}

const BrazePermissionModal: FC<BrazePermissionModalProps> = ({ braze }) => {
    const [modal, setModal] = useState(true)
    const [show, setShow] = useState(false)

    setTimeout(() => setShow(true), 1000)

    if (show) {
        return (
            <div
                className={`w-80 h-50 fixed top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 bg-cyan-800 p-10 z-50 ${modal ? 'block' : 'hidden'}`}
            >
                <p className="text-white">
                    Allow Braze to send you notifications?
                </p>
                <div className="flex justify-between items-center mt-4">
                    <Button
                        className="text-white bg-slate-400 h-auto px-4 py-1"
                        onClick={() => {
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
}

export default BrazePermissionModal
