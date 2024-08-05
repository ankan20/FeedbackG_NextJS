import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import nodemailer from 'nodemailer';
import VerificationEmail from "../../../../emails/VerificationEmail";
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

        //send verification email using resend
        // const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        // console.log(emailResponse);
        // if(!emailResponse.success){
        //     return Response.json({
        //         success:false,
        //         message:emailResponse.message,
        //     },{
        //         status:500
        //     })
        // }

        const transporter = nodemailer.createTransport({
            service:"gmail",
            port: 465, 
            secure: true, 
            auth: {
              user: process.env.SMTP_USER, 
              pass: process.env.SMTP_PASS,
            },
          });

          const emailResponse = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'FeedbackG | Verification code',
            html: `
              <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4CAF50;">Hello ${username},</h2>
                    <p style="font-size: 16px; line-height: 1.5;">
                      Thank you for registering. Please use the following verification code to complete your registration:
                    </p>
                    <h3 style="font-size: 20px; font-weight: bold; color: #333;">${verifyCode}</h3>
                    <p style="font-size: 16px; line-height: 1.5;">
                      If you did not request this code, please ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #777;">
                      Regards,<br/>
                      FeedbackG Team | Made by Ankan
                    </p>
                  </div>
                </body>
              </html>
            `,
          });
          
          

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