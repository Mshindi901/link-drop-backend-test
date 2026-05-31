export default class fileRepo{
    constructor(fileModel){
        this.model = fileModel
    };

    async createFile(userId, file_name, file_url, share_id, file_password){
        try {
            const file = await this.model.create({
                userId: userId,
                file_name: file_name,
                file_url: file_url,
                share_id: share_id,
                file_password: file_password
            });
            
            return{message: 'File Created'}
        } catch (error) {
            console.error(error);
            return{message: `Error with creating user function in repo ${error.message}`};
        }
    };

    async getUserFiles(userId){
        try {
            const userFiles = await this.model.findAll({
                where: {
                    userId: userId
                }
            })
           
            return {message : 'Files Fetched', data: userFiles};
        } catch (error) {
            console.error(error);
            return{message: `Error occured in getting users files function in repo ${error.message}`}
        }
    };

    async getFileByShareId(shareId){
        try {
            const file = await this.model.findOne({
                where: {share_id: shareId}
            })
            
            return{message: 'File fetched', data: file}
        } catch (error) {
            console.error(error);
            return{message: `Error occured in getting file by share Id in repo ${error.message}`}
        }
    };

    async deleteFileById(fileId){
        try {
            const deletedFile = await this.model.destroy({
                where: {id: fileId}
            })
            return{message: 'File deleted'}
        } catch (error) {
            console.error(error);
            return{message: `Error with deleting file function in repo ${error.message}`}
        }
    };

    async deleteUserFiles(userId){
        try {
            const userFiles = await this.model.findAll({
                where: {userId: userId}
            });
            
            const deletedFiles = await this.model.destroy(userFiles);
            
            return {message: 'Files deleted'}
        } catch (error) {
            console.error(error);
            return{message: `Error with deleting all user files function in repo ${error.message}`}
        }
    };

    async getFileById(id){
        try {
            const file = await this.model.fincByPk(id);
            
            return{message: 'File Fetched', data: file}
        } catch (error) {
            console.error(error);
            return{message:  `Error with getting file by Id function in repo ${error.message}`}
        }
    }
}