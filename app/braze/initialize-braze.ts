import { initialize } from '@braze/web-sdk'

export const initalizeBraze = () => {
    if (typeof window !== 'undefined') {
        initialize('0f75aa40-2b51-4cea-a382-c20fa456cb0f', {
            baseUrl: 'sdk.iad-03.braze.com',
            enableLogging: true,
        })
    }
}
