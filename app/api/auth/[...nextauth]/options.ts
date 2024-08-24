import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/app/api/auth/[...nextauth]/mongoDBClientPromise'
import env from '@/lib/root/Environment'

const { GITHUB_ID, GITHUB_SECRET, NEXTAUTH_DB } = env

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      name: 'Github-Provider',
    }),
  ],
  // @ts-ignore
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: NEXTAUTH_DB,
    collections: {
      Users: 'users',
      Accounts: 'accounts',
      Sessions: 'sessions',
      VerificationTokens: 'verification_tokens',
    },
  }),
}
