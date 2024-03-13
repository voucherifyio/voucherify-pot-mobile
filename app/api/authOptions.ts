import { DefaultSession, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCustomer } from '@/voucherify/get-customer'
import { getVoucherify } from '@/voucherify/voucherify-config'
import { JWT } from 'next-auth/jwt'

// interface Session extends DefaultSession {
//     user?:
//         | {
//               id?: string | null | undefined
//               name?: string | null | undefined
//               email?: string | null | undefined
//               image?: string | null | undefined
//           }
//         | undefined
// }

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

                if (!voucherifyCustomer?.source_id) {
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
            },
            async authorize(credentials, req) {
                if (!credentials?.phone) {
                    return null
                }

                return { id: credentials.phone }
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
    },
    secret: process.env.NEXTAUTH_SECRET,
}
