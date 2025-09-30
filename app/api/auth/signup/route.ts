import { connectMongo } from "@/config/db";
import { UserType } from "@/lib/types";
import User from "@/models/User";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";
export async function POST(req : NextRequest){
    try {
        await connectMongo();

        const {email, password, name, role } = await req.json();

        const existingUser : UserType | null = await User.findOne({email : email});
        if(existingUser){
            return NextResponse.json({
                success : false,
                message : 'User already exists',
            },{
                status: 400
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role,
        });
        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user : user.name
        },{
            status : 200
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            error: 'Failed to Create user'
        },{
            status : 500
        });
        
    }
}