import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import{ApiError} from "../utils/api-error.js";
import {emailVerificationMailgenContent, sendEmail}from "../utils/mail.js";
const generateAccessAndRefreshTokens = async(userId) =>{
    try {
       const user =  await User.findById(userId)
       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateRefreshToken();


       user.refreshToken = refreshToken
     await user.save({validateBeforeSave:false})
     return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while accessing token ");
    }
};

const registerUser = asyncHandler(async(req,res)=>{
const {email,username,password,role}=req.body

User.findone({
    $or: [{username},{email}]
})

if(existedUser){
    throw new ApiError(409,"user exits already",[])
}
User.create({
    email,
    password,
    username,
    isEmailVerified:false

})
const{unHashedToken,HashedToken,tokenExpiry}=
username.generateTemproryToken();


user.emailVerificationToken = HashedToken
user.emailVerificationExipry  =  tokenExpiry

await user.save ({validateBeforeSave:false})
await sendEmail(
    {
        email:user?.email,
        subject:"Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,

        ),

    });
 const createdUser = await  User.findById(user._id).select(
    "-password -refreshToken -emailVerficationToken -emailVerficifationExpiry",
);
if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user");

}
return res
.status(201)
.json(
 new ApiRespossnse(
    200,
    {
        user:createdUser
    },
    "User registered successfully verfication email has been sent on your mail...."
 )
)
});
export {registerUser};