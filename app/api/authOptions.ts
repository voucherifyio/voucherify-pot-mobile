import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCustomer } from '@/voucherify/get-customer'
import { getVoucherify } from '@/voucherify/voucherify-config'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                phone: { label: 'Phone number', type: 'text' },
            },
            async authorize(credentials, req) {
                if (!credentials?.phone) {
                    return null
                }

                const voucherifyCustomer = await getCustomer({
                    customer: { phone: credentials.phone },
                    voucherify: getVoucherify(),
                })

                if (!voucherifyCustomer?.id) {
                    return null
                }

                return { id: voucherifyCustomer.id }
            },
        }),
        CredentialsProvider({
            id: 'login-after-registration',
            name: 'RegistrationLogin',
            type: 'credentials',
            credentials: {
                phone: { label: 'Phone number', type: 'text' },
            },
            async authorize(credentials, req) {
                if (!credentials?.phone) {
                    return null
                }

                return { id: credentials.phone }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
}
