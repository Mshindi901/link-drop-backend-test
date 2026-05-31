export default class userRepo{
    constructor(userModel){
        this.model = userModel;
    };

    async createUser(username, email, password, role){
        try {
            const user = await this.model.create({
                username: username,
                email: email,
                password: password,
                role
            });
            return {message: 'New User Created', data: user}
        } catch (error) {
            throw new Error(`Error in create user function in repo ${error}`)
        }
    };

    async updateUser(id, username, email, password){
        try {
            const updatedUser = await this.model.update({
                where: {id: id},
                username: username,
                email: email,
                password: password,
            });
            return {message: 'User updated'}
        } catch (error) {
            console.error(error);
            return {message: `Error with Updating user function in repo ${error.message}`}
        }
    };

    async addOTP(id, otp, expiry){
        try {
            const addOTP = await this.model.update({
                otp: otp,
                otp_expiry: expiry
            }, {
                where: {id: id}
            });
            return{success: true, message: 'OTP set'}
        } catch (error) {
            console.error(error);
            return{success: false, message: `Error with assigning user their OTP ${error.message}`}
        }
    };

    async deleteOTP(id){
        try {
            const OTP = await this.model.update({
                where: {id: id},
                otp: null,
                otp_expiry: null
            });
            return{success: true, message: 'OTP deleted'}
        } catch (error) {
            console.error(error);
            return{success: false, message: `Error with deleting the OTP function in repo ${error.message}`}
        }
    }

    async getUserById(id){
        try {
            const user = await this.model.findByPk(id);
            return{message: 'User Fetched', data: user};
        } catch (error) {
            console.error(error);
            return {message: `Error with getting user by Id function in repo ${error.message}`}
        }
    };

    async getUserByEmail(email){
        try {
            const user = await this.model.findOne({
                where: {email: email}
            });
            return {message: 'User fetched', data: user};
        } catch (error) {
            console.error(error);
            return {message: `Error with getting user by email function in repo ${error.message}`}
        }
    };

    async getUsers(){
        try {
            const users = await this.model.findAll();
            return {message: 'Users Fetched', data: users}
        } catch (error) {
            console.error(error);
            return{message: `Error occured with the getting all users function in repo ${error.message}`}
        }
    };

    async deleteUser(id){
        try {
            const deletedUser = await this.model.destroy({
                where: {id: id}
            });
            return {message : 'User deleted'}
        } catch (error) {
            console.error(error);
            return {message: `Error in deleting user function in repo ${error.message}`}
        }
    }
}