import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { inngest } from "@/config/inngest";


export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, item } = await request.json();

        if (!address || item.length === 0) {
            return NextResponse.json({
                success: false,
                message: "invalid data"
            });
        }

        //calculate amount using items

        const amount = await item.reduce(async (acc, item) => {
            const product = await Product.findById(item.productId);
            return acc + (product.offerPrice * item.quantity);
        }, 0)
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                item,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
        })
        const user = await User.findById(userId);
        user.cartItems = {}
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Order created successfully"
        });
    } catch (error) {
        console.log(error);
        NextResponse.json({
            success: false,
            message: error.message
        });
    }

}