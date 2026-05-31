export default class linkRepo{
    constructor(linkModel){
        this.model = linkModel
    };

    async createLink(file_id, Link){
        try {
            const link =  await this.model.create({file_id: file_id, link: Link});
            return {message: 'Link Created'}
        } catch (error) {
            console.error(error);
           return{message: `Error with Link creation function in repo ${error.message}`} 
        }
    };

    async getLinkById(id){
        try {
            const link = await this.model.findByPK(id);
            
            return{message: 'Link Fetched', data: link}
        } catch (error) {
            console.error(error);
            return {message: `Error occured in get link by Id function in repo ${error.message}`}
        }
    };

    async getLinkByFileId(fileId){
        try {
            const fileLink = await this.model.findOne({
                where: {file_id: fileId}
            });
            
            return {messgae: 'Link Fetched', data: fileLink}
        } catch (error) {
            console.error(error);
            return{message: `Error occured in getting link by file id function in repo ${error.message}`}
        }
    };

    async deleteLinkById(linkId){
        try {
            const deletedFile = await this.model.destroy({
                where: {id: linkId}
            })
            
            return {message: 'Link deleted'}
        } catch (error) {
            console.error(error);
            return {message: `Error occured in the deleting Link function in repo ${error.message}`}
        }
    };

    async deleteLinkByFileId(FileId){
        try {
            const deletedFile = await this.model.destroy({
                where: {fileId: FileId}
            })
            return {message: 'Link deleted'}
        } catch (error) {
            console.error(error);
            return {message: `Error occured in the deleting Link function in repo ${error.message}`}
        }
    };
}