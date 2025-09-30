import { connectMongo } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import User from "@/models/User";
import { JWTPayloadType, UserType } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET!


export async function GET(req: NextRequest){
    try{
        await connectMongo();
        const token = req.cookies.get('token')?.value;
        if(!token) {
            return NextResponse.json({
                success : false,
                message: 'No token found'
            }, {
                status : 401
            });
        }

        const verifyToken = jwt.verify(token, JWT_SECRET) as JWTPayloadType;

        const user : UserType | null = await User.findById(verifyToken.userId);
        if(!user){
            return NextResponse.json({
                success : false,
                message: 'User not found'
            }, {
                status : 401
            });
        }


        return NextResponse.json({
                success : true,
                user : user.name
            }, {
                status : 200
            });


    } catch (err) {
        console.error('Error getting user: ', err)
        return NextResponse.json({
                success : false,
                message: 'Error fetching user'
            }, {
                status : 401
            });
    }

}