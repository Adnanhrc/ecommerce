import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {address} = await request.json();
        await connectDB();
        const userAddress = await Address.create({...address, userId});
        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            newAddress
        });
        
    } catch (error) {
        NextResponse.json({
            success: false,
            message: error.message
        });
    }
}