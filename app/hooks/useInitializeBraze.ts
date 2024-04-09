import { useEffect, useState } from 'react'
import * as instanceBraze from '@braze/web-sdk'

export const useInitalizeBraze = () => {
    const [braze, setBraze] = useState<
        typeof import('../../node_modules/@braze/web-sdk/index') | undefined
    >()

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            process.env.NEXT_PUBLIC_BRAZE_API_KEY &&
            process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT
        ) {
            instanceBraze.initialize(process.env.NEXT_PUBLIC_BRAZE_API_KEY, {
                baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT,
                enableLogging: true,
                allowUserSuppliedJavascript: true,
                minimumIntervalBetweenTriggerActionsInSeconds: 5,
            })
            setBraze(instanceBraze)
        }
    }, [
        process.env.NEXT_PUBLIC_BRAZE_API_KEY,
        process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT,
    ])

    const changeBrazeUser = async ({
        customerId,
    }: {
        customerId: string | null | undefined
    }) => {
        if (typeof window !== 'undefined' && customerId && braze) {
            instanceBraze.changeUser(customerId)
            return instanceBraze.getUser()?.getUserId()
        }
    }

    return { braze, changeBrazeUser }
}
