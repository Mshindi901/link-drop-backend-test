import File from "../models/file.js";
import fileRepo from "../repositories/file-repository.js";
import fileService from "../services/file.service.js";
import Link from "../models/links.js";
import linkRepo from "../repositories/link-repository.js";
import linkService from "../services/link.service.js";
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";
import { error } from "console";
dotenv.config()

const file_repo = new fileRepo(File);
const file_service = new fileService(file_repo);

const link_repo = new linkRepo(Link);
const link_service = new linkService(link_repo, file_repo);

export const newFile = async(req, res) => {
    try {
        const {file_name, file_password} = req.body;
        const file = req.file;
        if(!file_name || !file){
            return res.status(400).json({
                success: false,
                message: 'Provide File Name'
            })
        };
        const userId = req.user.id
        if(!userId){
            return res.status(400).json({
                success: false,
                message: 'User not Authenticated'
            });
        };
        const app_url = process.env.APP_URL;
        const file_url = `${app_url}/uploads/${file.filename}`;

        const File = await file_service.addNewFile(userId, file_name, file_url, file_password);
        if(!File){
            return res.status(404).json({
                success: false,
                message: 'Error with creating new file',
                error: File.message
            })
        };
        
        //after file creation I create the link too
        const new_link = await link_service.creatingNewLink(File.data.share_id, File.data.id);
        if(!new_link){
            return res.status(404).json({
                success: false,
                message: 'Error with creating new link',
                error: new_link.message
            })
        };

        return res.status(200).json({
            success: true,
            message: 'File Created with link',
            data: File.data
        })

       
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getUsersFiles = async(req, res) => {
    try {
        const id = req.user.id;
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'Not Authenticated, please Login'
            })
        };
        const files = await file_service.getUserFile(id);
        if(!files){
            return res.status(404).json({
                success: false,
                message: 'Error occured in fetching user files',
                error: files.message
            });
        };
        return res.status(200).json({
            success: true,
            message: 'User files fetched',
            data: files.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const openFile = async(req, res) => {
    try {
        const shareId = req.params;
        if(!shareId){
            return res.status(400).json({
                success: false,
                message: 'No share Id Provided'
            });
        };
        const file = await file_service.openningFile(shareId);
        if(!file){
            return res.status(404).json({
                success: false,
                message: 'Error with getting the file'
            });
        };
        return res.status(200).json({
            success: true,
            message: 'File Found',
            data: file.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getFileShareLink = async (req, res) => {
    try {
        const fileId = req.params;
        if(!fileId){
            return res.status(400).json({
                success: false,
                message: 'No file Id Provided'
            });
        };
        const link = await link_service.getLinkByFileId(fileId);
        if(!link.data){
            return res.status(404).json({
                success: false,
                message: 'Error getting link record',
                error:  link.message
            })
        };
        return res.status(200).json({
            success: true,
            message: 'Link fetched',
            data: link.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export const deleteUserFiles = async (req, res) => {
    try {
        const userId = req.user.id;
        if(userId){
            return res.status(400).json({
                success: false,
                message: 'User not authenticated'
            });
        };
        const deletedFiles = await file_service.deleteUserFiles(userId);
        if(!deletedFiles || deletedFiles.length === 0){
            return res.status(404).json({
                success: false,
                message: 'Error with deleting a user function or No user files',
                error: deleteUserFiles.message
            })
        };
        for (const file of deletedFiles){
            const file_path = path.join("uploads", file.file_name);
            try {
                await fs.unlink(file_path);
            } catch (error) {
                console.error(error.message);
                return null;
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Files deleted'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const deleteFile = async(req, res) => {
    try {
        const fileId = req.params;
        if(!fileId){
            return res.status(400).json({
                success: false,
                message: 'File Id not provided'
            });
        };
        const file = await file_service.getFileById(fileId);
        if(!file){
            return res.status(400).json({
                success: false,
                message: 'Wrong File Id',
                error: file.message
            });
        };

        const file_path = path.join("uploads", file.file_name);
        await fs.unlink(file_path, async(err) => {
            if(err){
                console.error(err)
            }
        })
        const detedFile = await file_service.deleteFile(fileId);
        if(!deleteFile){
            return res.status(404).json({
                success: false,
                message: 'Error with deleting file',
                error: deleteFile.message
            });
        };
        //deleting Link
        const deletedLink = await link_service.deleteLinkByFileId(fileId);
        if(!deletedLink){
            return res.status(404).json({
                success: false,
                message: 'Error with deleting Link',
                error: deletedLink.message
            });
        };
        return res.status(200).json({
            success: true,
            message: 'File and Link deleted'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};