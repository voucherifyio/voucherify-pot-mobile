import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCustomer } from '@/voucherify/get-customer'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { METADATA } from '@/enum/metadata'
import { randomBytes } from 'crypto'

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

                if (
                    !voucherifyCustomer?.source_id ||
                    !voucherifyCustomer?.metadata[METADATA.REGISTERED_CUSTOMER]
                ) {
                    return null
                }

                return {
                    id: voucherifyCustomer.source_id,
                    name: voucherifyCustomer.name,
                }
            },
        }),
        CredentialsProvider({
            id: 'login-after-registration',
            name: 'RegistrationLogin',
            type: 'credentials',
            credentials: {
                phone: { label: 'Phone number', type: 'text' },
                firstName: { label: 'First name', type: 'text' },
            },
            async authorize(credentials, req) {
                if (!credentials?.phone) {
                    return null
                }

                return { id: credentials.phone }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        generateSessionToken: () => {
            return randomBytes(32).toString('hex')
        },
    },
    callbacks: {
        session: async ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
                token,
            },
        }),
    },
    secret: process.env.NEXTAUTH_SECRET,
}
