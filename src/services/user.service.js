import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateOTP from '../utils/otp-creation.js';
import {client} from '../inngest/client.js'
import dotenv from 'dotenv';
dotenv.config()


export default class userService{
    constructor(userRepo){
        this.userRepo = userRepo
    };

    async signUp(username, email, password, role){
        try {
            if(!username || !email || !password){
                return{success: false, message: 'No user Data sent'}
            };
            const response = await this.userRepo.getUserByEmail(email);
            if(response.data){
                return {success: false, message: 'Cannot have multiple accounts'};
            };
            //hashing
            const haashedPassword = await bcrypt.hash(password, 10);

            const newAccount = await this.userRepo.createUser(username, email, haashedPassword, role);
            if(!newAccount){
                return {success: false, message: 'Error with creating account function in service', error: newAccount.message}
            };
            return {success: true, message: 'Account created successfully'}
        } catch (error) {
            console.error(error);
            return {success: false, message: `Error with signing up function in repo ${error.message}`};
        }
    };

    async signIn(email, password){
        try {
            if(!process.env.JWT_TOKEN){
                return {message: 'Server configuration error: JWT_TOKEN not set', success: false}
            };
            const response = await this.userRepo.getUserByEmail(email);
            if(!response.data){
                return {success: false, error: 'Create an Account', message: response.message}
            };
            const isUser = response.data;
            const isPassword = await bcrypt.compare(password, isUser.password);
            if(!isPassword){
                return {success: false, message: 'Invalid Password'}
            };
            const signToken = jwt.sign({id: isUser.id, email: isUser.email, role: isUser.role}, process.env.JWT_TOKEN, {expiresIn: '1h'});
            
            return {message: 'Logged in successfully', data: signToken, success: true, user: isUser}
        } catch (error) {
            console.error(error);
            return{message: `Error with sign in function in service ${error.message}`, success: false}
        }
    };

    //Its better if I split the signing in fucntion with the assigning the user OTP
    async assignOTP(userId){
        try {
            //setting up the OTP to be stored 
            const otp = generateOTP();
            //hashing the OTP for security
            const hashedOTP = await bcrypt.hash(otp, 10);
            //creating a 5 min expiry
            const expiry = new Date(Date.now() + 5 * 60 * 1000);
            //Adding OTP to user record
            const addedOTP = await this.userRepo.addOTP(userId, hashedOTP, expiry);
            if(!addedOTP){
                throw new Error('User was assigned his Token but failed to add OTP');
                return{success: false, message: 'Error assigning user their token upon login'}
            };
            const res = await this.userRepo.getUserById(userId);
            if(!res.data){
                throw new Error('Invalid User ID or an Error occured with getting user info');
                return{success: false, message: 'Error with fetching user info'}
            };
            const user = res.data;
            //sending the Email will be handled here
            await client.send({
                name: 'user/send.otp',
                data: {email: user.email, otp}
            });
            return {success: true, message: 'OTP Added to Database and emailed to user'}
        } catch (error) {
            console.error(error);
            return{success: false, message: `Error with assigning user their OTP function in service ${error.message}`}
        }
    };

    async OTPverification(Otp, userId){
        try {
            const res = await this.userRepo.getUserById(userId);
            if(!res.data){
                throw new Error('Invalid User ID or an Error occured with getting user info');
                return{success: false, message: 'Error with fetching user info'}
            };
            const user = res.data;
            if(new Date() > user.otp_expiry){
                await this.userRepo.deleteOTP(user.id)
            };
            const is_otp = await bcrypt.compare(Otp, user.otp);
            if(!is_otp){
                throw new Error('Wrong OTP sent')
                return{success: false, message: 'Error wrong OTP'}
            };
            //deleting OTP after successful verification
            await this.userRepo.deleteOTP(user.id);
            return{success: true, message: 'OTP verified'}
        } catch (error) {
            console.error(error);
            return{success: false, message: `Error with verifying OTP function in service ${error.message}`}
        };
    };

    async updateAccount(id, username, email, password){
        try {
            const response = await this.userRepo.getUserById(id);
            if(!response.data){
                return {message: 'Id belongs to no user'}
            };
            const updatedAccount = await this.userRepo.updateUser(id, username, email, password);
            if(!updatedAccount){
                return{message: 'Failed to update account in service', error: updatedAccount.message}
            };
            return{message: 'Account Updated'}
        } catch (error) {
            console.error(error);
            return {message: `Error with updating Account function in service ${error.message}`}
        }
    }

    async getAccountById(id){
        try {
            if(!id){
                return {message: 'No user id Provided'}
            };
            const account = await this.userRepo.getUserById(id);
            if(!account.data){
                return{message: 'Failed to fetch user account in service', error: account.message}
            };
            return {message: 'Account Fetched', data: account.data}
        } catch (error) {
            console.error(error);
            return {message: `Error with getting account by id function in service ${error.message}`}
        }
    };

    async getAllAccounts(){
        try {
            const users = await this.userRepo.getUsers();
            if(!users.data){
                return{message: 'Failed to fetch all users function in service'}
            };
            return{message: 'Accounts fetched', data: users.data}
        } catch (error) {
            console.error(error);
            return{message: `Error with getting all accounts function in service ${error.message}`}
        }
    }
    
    async deleteAccount(id){
        try {
            if(!id){
                return {message: 'No user ID sent'}
            };
            const deleteAccount = await this.userRepo.deleteUser(id);
            if(!deleteAccount){
                return{message: 'Failed To delete account in service', error: deleteAccount.message}
            };
            return{message: 'Account deleted'}
        } catch (error) {
            console.error(error);
            return {message: `Error with deleting account function in service ${error.message}`}
        }
    };
}