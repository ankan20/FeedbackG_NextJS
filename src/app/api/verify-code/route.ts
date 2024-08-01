import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import {z} from 'zod';

const verifyCodeSchema = z.string().length(6,"Verification code must be 6 digits")
export async function POST(request:Request){
    dbConnect();
    try {
        const {username,code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const result = verifyCodeSchema.safeParse(code);
        
        if(!result.success){
            const verifyCodeError = result.error.format()._errors || [];
            return Response.json({
                success:false,
                message:verifyCodeError.length > 0 ?verifyCodeError.join(', '):'Invalid verification code',
            },{status:400});
        }
        
        const VerifyCode = result.data;
        const user = await UserModel.findOne({username:decodedUsername});

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:500});
        }

        const isCodeValid = user.verifyCode === VerifyCode;
        
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        
        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true;
            await user.save();
            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{status:200});
        }
        else if(!isCodeValid){
            return Response.json({
                success:false,
                message:"Incorrect verification code"
            },{status:400});
        }
        else {
            return Response.json({
                success:false,
                message:"verification code has expired ,please signup again to get a new code"
            },{status:400});
        }


    } catch (error) {
        console.error("Error verification code ",error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500});
    }
   
}