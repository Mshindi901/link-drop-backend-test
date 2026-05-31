import User from "../models/user.js";
import userRepo from "../repositories/user-repositpry.js";
import userService from "../services/user.service.js";

const user_repo = new userRepo(User);
const user_service = new userService(user_repo);

export const signUp = async(req, res) => {
    try {
        const {username, email, password, role} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                success: false,
                message: 'Missing Information'
            });

        };
        const user = await user_service.signUp(username, email, password, role);
        if(!user.success){
            return res.status(404).json({
                success: false,
                message: 'Failed to sign up user',
                error: user.message
            })
        };
        return res.status(201).json({
            success: true,
            message: 'Account created'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
};

export const signIn = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Missing Information'
            })
        };
        const user_signed_in = await user_service.signIn(email, password);
        if(!user_signed_in.success){
            return res.status(404).json({
                success: false,
                message: 'Failed to sign in user',
                error: user_signed_in.message
            });
        };
        return res.status(200).json({
            success: true,
            message: 'User signed in',
            data: user_signed_in.data,
            user: user_signed_in.user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const updateUser = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        const id = req.user.id;
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'User not logged in or Token expired'
            });
        };
        const updatedUser = await user_service.updateAccount(id, username, email, password);
        if(!updatedUser.message || updatedUser.message.includes('Error')){
            return res.status(404).json({
                success: false,
                message: 'Error with user update',
                error: updatedUser.message
            });
        };
        return res.status(200).json({
            success: true,
            message: 'User Updated'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const fetchUserInfo = async(req, res) => {
    try {
        const id = req.user.id;
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'User not logged in or Token expired'
            });
        };
        const user_info = await user_service.getAccountById(id);
        if(!user_info.data){
            return res.status(404).json({
                success: false,
                message: 'Error with getting user Info',
                error: user_info.message
            })
        };
        return res.status(200).json({
            success: true,
            message: 'User Fetched',
            data: user_info.data
        })
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        }); 
    }
};

export const fetchAllUsers = async(req, res) => {
    try {
        const users = await user_service.getAllAccounts();
        if(!users.data){
            return res.status(404).json({
                success: false,
                message: 'Error with getting all users',
                error: users.message
            })
        };
        return res.status(200).json({
            success: true,
            message: 'Users Fetched',
            data: users.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        }); 
    }
}

export const deleteUser = async(req, res) => {
    try {
        // Check if admin is deleting a specific user via URL parameter
        const userIdToDelete = req.params.id || req.user.id;
        
        if(!userIdToDelete){
            return res.status(400).json({
                success: false,
                message: 'User not logged in or Token expired'
            });
        };
        
        const deletedUser = await user_service.deleteAccount(userIdToDelete);
        if(!deletedUser.message || deletedUser.message.includes('Error')){
            return res.status(404).json({
                success: false,
                message: 'Error in deleting user',
                error: deletedUser.message
            });
        };
        return res.status(200).json({
            success: true,
            message: 'Account deleted'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const AssigninOTP = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success: false,
                message: 'User Not authenticated'
            });
        };
        const otp = await user_service.assignOTP(userId);
        if(!otp.success){
            return res.status(400).json({
                success: false,
                message: 'Error with assignin a user otp',
                error: otp.message
            });
        };
        return res.status(200).json({
            success: true,
            message: 'OTP assigned to user'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export const verifyOTP = async(req, res) => {
    try {
        const otp = req.body;
        if(!otp){
            return res.status(400).json({
                success: false,
                message: 'OTP was not provided'
            })
        }
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success: false,
                message: 'User Not authenticated'
            });
        };

        const verify = await user_service.OTPverification(otp, userId);
        if(!verify.success){
            return res.status(404).json({
                success: false,
                message: 'Error with verifying user OTP',
                error: verify.message
            })
        };
        return res.status(200).json({
            success: true,
            message: 'OTP verified'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};