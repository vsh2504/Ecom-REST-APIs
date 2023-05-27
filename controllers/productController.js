import multer from "multer";
import { Product } from "../models";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import fs from "fs";
import Joi from "joi";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // 3746674586-836534453.png
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits: { filesize: 1000000 * 5 }}).single('image'); // 5MB

const productController = {
    async store(req, res, next) {
        // Multipart form data (Not json data as we need to accept things like img and all form client)
        // Express does not support multi-part data; Install a new lib called multer
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // Multer will make this file property available on request object
            const filePath = req.file.path;

            // Validation
            const refreshSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                size: Joi.string().required(),
            });

            const { error } = loginSchema.validate(req.body);

            if (error) {
                // Delete the uploaded image file
                // rootfolder/uploads/filename.png
                fs.unlink(`${appRoot}/${filepPath}`, (err) => {
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message));
                    }             
                });

                return next(error);
            }

            const { name, price, size } = req.body;
            let document;

            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch(err) {
                return next(err);
            }
            
            // Whenever a document is created/saved send 201
            res.status(201).json(document);
        });
    }
}

export default productController;