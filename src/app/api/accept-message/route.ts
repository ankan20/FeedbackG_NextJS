import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You must be logged in to accept a message.",
        },{
            status:401
        })
    }

    const userId = user._id;
    const {acceptMessages}=await request.json();
    // console.log(acceptMessages);
    try {

        const updatedUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true});
        
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"failed to update user status to accept messages",
            },{
                status:401
            })
        }

        return Response.json({
            success:true,
            message:"Message acceptance status updated successfully",
            updatedUser
        },{
            status:200
        })
        
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json({
            success:false,
            message:"failed to update user status to accept messages",
        },{
            status:500
        })
    }


    
}

export async function GET(request:Request){
    await dbConnect();
    const session =await getServerSession(authOptions);
    const user:User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"You must be logged in to accept a message.",
        },{
            status:401
        })
    }
    const userId = user._id;
    try {
        const dbUser = await UserModel.findById(userId);
        if(!dbUser){
            return Response.json({
                success:false,
                message:"user not found",
            },{
                status:404
            })
        }
        const acceptMessagesStatus = dbUser?.isAcceptingMessage;

        return Response.json({
            success:true,
            isAcceptingMessages:acceptMessagesStatus
        })

    } catch (error) {
        console.log("failed to send user message acceptance status")
        return Response.json({
            success:false,
            message:"failed to send user message acceptance status",
        },{
            status:500
        })
    }

}