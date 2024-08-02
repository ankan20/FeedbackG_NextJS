import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import {Message} from '@/model/User';

export async function POST(request: Request){
    await dbConnect();

    const {username,content} = await request.json();
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        //is user accepting messages? then only do it
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting the messages"
            },{status:403})
        }
        const newMessage= {
            content,
            createdAt:new Date(),
        };
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
            success:true,
            message:"message sent successfully"
        },{status:200})
    } catch (error) {
        console.error("Error adding messages ",error)
        return Response.json({
            success:false,
            messages:"Internal server error"
        },{
            status:500
        })
    }
}
