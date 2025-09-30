import { connectMongo } from "@/config/db";
import { UserType } from "@/lib/types";
import User from "@/models/User";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET!


export async function POST(req: NextRequest) {
    try {
        await connectMongo();

        const { email, password } = await req.json();

        const user : UserType | null = await User.findOne({ email: email });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Invalid Credentials',
            }, {
                status: 401
            });

        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: 'Invalid Credentials',
                
            }, {
                status: 401
            });
        }

        const token = await jwt.sign({
            userId : user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
        }, JWT_SECRET, {
            expiresIn: '7d'
        });

        const response = NextResponse.json({
            success : true,
            message : 'Signed in Successfully',
            user : {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        })
        response.cookies.set('token', token, {
            httpOnly : true,
            sameSite : 'strict',
            maxAge : 3600 * 24 * 7
        });

        return response;
        

       
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            error: 'Sign in failed'
        }, {
            status: 500
        });

    }
}