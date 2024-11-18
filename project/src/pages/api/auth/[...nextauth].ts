import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import db from '../../../lib/db';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user }) {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT OR IGNORE INTO users (id, email, name) VALUES (?, ?, ?)',
          [user.id, user.email, user.name],
          (err) => {
            if (err) {
              console.error('Error saving user:', err);
              reject(false);
            } else {
              resolve(true);
            }
          }
        );
      });
    },
  },
});