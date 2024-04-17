import { CampaignResponse, VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
}

export const listCampaigns = async (params: Params) => {
    const { voucherify } = params

    try {
        const { campaigns }: { campaigns: CampaignResponse[] } =
            await voucherify.campaigns.list()

        if (campaigns.length === 0) {
            return null
        }

        return campaigns
    } catch (err) {
        return null
    }
}
