import { getVoucherify } from '@/voucherify/voucherify-config'
import { getQualifications } from '@/voucherify/get-qualifications'

export async function POST(req: Request) {
    const { customerId, scenario } = await req.json()

    if (customerId) {
        const qualifications = await getQualifications({
            customerId,
            voucherify: getVoucherify(),
            scenario
        })

        return Response.json(
            { qualifications: qualifications },
            { status: 200 }
        )
    }
    return Response.json({ status: 400 })
}
