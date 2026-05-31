import { error } from 'console';
import crypto from 'crypto'

export default class fileService{
    constructor(fileRepo){
        this.fileRepo = fileRepo;
    };

    async addNewFile(userId, file_name, file_url, file_password){
        try {
            //we'll only generate the share Id here, but everything else comes from controllers
            if(!userId || !file_name || !file_url || !file_password){
                return{message: 'Missing critical info, not sent'}
            };
            //generating share_id
            const share_id = await crypto.randomBytes(8).toString('hex');
            if(!share_id){
                return {message: 'Error generating shareId For File'}
            };
            const newFile = await this.fileRepo.createFile(userId, file_name, file_url, share_id, file_password);
            if(!newFile){
                return {message: 'Error with creating a new file in service', error: newFile.message}
            };
            return{message: 'File Created', data: newFile}
        } catch (error) {
            console.error(error);
            return {message: `Error with adding anew file function in service ${error.message}`}
        }
    }

    async openningFile(shareId){
        try {
            const isFile = await this.fileRepo.getFileByShareId(shareId);
            if(!isFile){
                return {message: 'Error with getting file in service', error: isFile.message}
            };
            return{message: 'File Fetched', data: isFile.file_url}
        } catch (error) {
            console.error(error);
            return {message: `Error with openning file function in service ${error.message}`}
        }
    }

    async getUserFile(userId){
        try {
            const userFiles = await this.fileRepo.getUserFiles(userId);
            if(!userFiles || userFiles.length === 0){
                return{message: 'Error with getting user files occured in service or no user files yet', error: userFiles.message}
            };
            return{message: 'User Files Fetched', data: userFiles}
        } catch (error) {
            console.error(error);
            return {message: `Error occured with getting a users files function in service ${error.message}`}
        }
    }

    //FOR MVP i am only deleting the record in our database at testing will improve to also remove the file
    //file are also deleted 

    async deleteFile(fileId){
        try {
            const deletedFile = await this.fileRepo.deleteFileById(fileId);
            if(!deletedFile){
                return {message: 'Failed to delete File In service', error: deletedFile.message}
            };
            return{message: 'File deleted'}
        } catch (error) {
            console.error(error);
            return{message: `Error with file deletion function in service ${error.message}`}
        }
    }

    async deleteUserFiles(userId){
        try {
            const deletedFiles =  await this.fileRepo.deleteUserFiles(userId)
            if(!deletedFiles){
                return {message: "Error with deleting user files", error: deletedFiles.message}
            };
            return{message: 'File deleted'}
        } catch (error) {
            console.error(error)
            return {message:  `Error wwith deletimng a users file function in service ${error.message}`}
        }
    }
    
    async getFileById(fileId){
        try {
            const file = await this.fileRepo.getFileById(fileId);
            
            return{message: 'File Fetched', data: file.data}
        } catch (error) {
            console.error(error);
            return{message  : `Error with getting the file by id function in service ${error.message}`}
        }
    }
}