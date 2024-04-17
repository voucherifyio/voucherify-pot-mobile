import {
    CampaignResponse,
    RewardsCreateResponse,
    VoucherifyServerSide,
} from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const listRewards = async (params: Params) => {
    const { voucherify } = params

    try {
        const { data }: { data: RewardsCreateResponse[] } =
            await voucherify.rewards.list()

        if (data.length === 0) {
            return null
        }

        return data
    } catch (err) {
        return null
    }
}
