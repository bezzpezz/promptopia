import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({ profile, user }) {
            try {
                await connectToDB();

                // check if a user already exists
                const userExists = await User.findOne({
                    email: profile.email
                })

                // if not, create a new user
                if (!userExists) {
                    console.log("No Existing User!");
                    await User.create({
                        // _id: user?.id || 1234,
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture
                    })
                }

                console.log("User Created");
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async session({ session }) {
            await connectToDB();

            const sessionUser = await User.findOne({
                email: session.user.email
            })

            if (sessionUser) {
                session.user.id = sessionUser._id.toString();
            }

            return session;
        },
    },
})

export { handler as GET, handler as POST };