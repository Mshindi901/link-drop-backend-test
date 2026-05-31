import dotenv from 'dotenv';
dotenv.config()

export default class linkService{
    constructor(linkRepo, fileRepo){
        this.linkRepo = linkRepo;
        this.fileRepo = fileRepo
    };

    async creatingNewLink(share_id, file_id){
        try {
            const isFile = await this.fileRepo.getFileByShareId(share_id);
            if(!isFile){
                return{message: 'Error with checking if share_id works occured in service', error: isFile.message}
            };
            //LInk generation
            const APP_URL = process.env.APP_URL;
            const Link = `${APP_URL}/file/:${share_id}`;
            const newLink = await this.linkRepo.createLink(file_id, Link);
            if(!newLink){
                return {message: 'Error with creating a new Link record in service', error: newLink.message}
            }
        } catch (error) {
            console.error(error);
            return {message: `Error occured with creating a new link function in service ${error.message}`}
        }
    }

    async getLinkByFileId(fileId){
        try {
            const link = await this.linkRepo.getLinkByFileId(fileId);
            if(!link){
                return{message: 'Error occured in fetching link', error: link.message}
            };
            return{message: 'Link fetched', data: link.link}
        } catch (error) {
            console.error(error);
            return{message: `Error with getting link by file Id ${error.message}`}
        }
    }

    async deleteLinkByFileId(fileId){
        try {
            const deletedLink = await this.linkRepo.deleteLinkByFileId(fileId);
            if(!deletedLink){
                return{message: 'Error occured with deleting link ', error: deletedLink.message}
            };
            return{message: 'Link deleted'}
        } catch (error) {
            console.error(error);
            return{message: `Error occured in deleting link by file id function in service ${error.message}`}
        }
    }
}