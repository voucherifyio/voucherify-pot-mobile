import * as instanceBraze from '@braze/web-sdk'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

export const useInitalizeBraze = () => {
    const [braze, setBraze] = useState<
        typeof import('../../node_modules/@braze/web-sdk/index') | undefined
    >()
    const { status, data } = useSession()

    const handleBraze = useCallback(async () => {
        if (
            typeof window !== 'undefined' &&
            status === 'authenticated' &&
            data.user?.id
        ) {
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
                instanceBraze.changeUser(data.user.id)
                return setBraze(instanceBraze)
            }
        }
    }, [status])

    useEffect(() => {
        handleBraze()
    }, [handleBraze])

    return { braze }
}
