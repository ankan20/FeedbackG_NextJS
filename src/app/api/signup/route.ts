import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST (request:Request){
    //make database connection
    await dbConnect();

    try {

        const {username,email,password} = await request.json();
        //verified by username 
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{
                status:400
            })
        }

        //existing user with email but not verified with username
        const existingUserByEmail = await UserModel.findOne({email});

        //verification code 6 digit
        const verifyCode = Math.floor(Math.random()*999999).toString();

        if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email",
                },{
                    status:400
                })
            }else {
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry= new Date(Date.now()+3600000);

                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,
            },{
                status:500
            })
        }
        return Response.json({
            success:true,
            message:"User registered successfully.Please verify your email",
        },{
            status:201
        })

        
        
    } catch (error) {
        console.error("Error registering user ",error);
        return Response.json({
            success:false,
            message:"Error registering user"
        },
    {
        status:500
    })
    }
}