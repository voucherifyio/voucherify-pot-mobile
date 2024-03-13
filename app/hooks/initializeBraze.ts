import * as instanceBraze from '@braze/web-sdk'
import { useSession } from 'next-auth/react'
import { FC, useCallback, useEffect, useState } from 'react'

export const useInitalizeBraze = () => {
    const [braze, setBraze] = useState<
        | typeof import('/Users/patryk.smolarz/Desktop/Patryk/parkland-mobile/node_modules/@braze/web-sdk/index')
        | undefined
    >()
    const { status } = useSession()

    const handleBraze = useCallback(async () => {
        if (typeof window !== 'undefined' && status === 'authenticated') {
            const isInit = instanceBraze.initialize(
                process.env.NEXT_PUBLIC_BRAZE_API_KEY!,
                {
                    baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT!,
                    enableLogging: true,
                    allowUserSuppliedJavascript: true,
                    minimumIntervalBetweenTriggerActionsInSeconds: 5,
                }
            )
            if (isInit) {
                braze?.changeUser('987654321')
                instanceBraze.automaticallyShowInAppMessages()
                instanceBraze.requestPushPermission()
                instanceBraze.openSession()
                return setBraze(instanceBraze)
            }
        }
    }, [status])

    useEffect(() => {
        handleBraze()
    }, [handleBraze])

    return { braze }
}
