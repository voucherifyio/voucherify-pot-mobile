import { CampaignResponse, VoucherifyServerSide } from '@voucherify/sdk'

type Params = {
    voucherify: ReturnType<typeof VoucherifyServerSide>
    campaignId: string
}

export const getCampaign = async (params: Params) => {
    const { voucherify, campaignId } = params

    try {
        const fetchedCampaign = (await voucherify.campaigns.get(
            campaignId
        )) as CampaignResponse

        if (!fetchedCampaign?.id) {
            return null
        }

        return fetchedCampaign
    } catch (err) {
        return null
    }
}
