import connectDB from "@/utils/db";
import User from "@/models/User";   
import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/Address";


export async function GET(request) {
    try {
        // Get the user ID from the request
        const { userId } = getAuth(request);
        
        // Connect to the database
        await connectDB();
        
        // Find the user in the database
        const addresses = await Address.find({userId});

        return NextResponse.json({
            success: true,
            addresses
        });
    } catch (error) {
        // Return an error response if something goes wrong
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
}