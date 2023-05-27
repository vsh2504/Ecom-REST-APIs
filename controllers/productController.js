import multer from "multer";
import { Product } from "../models";
import path from 'path';
import CustomErrorHandler from "../services/CustomErrorHandler";
import fs from "fs";
import Joi from "joi";
import productSchema from "../validators/productValidator";

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
            const { error } = productSchema.validate(req.body);

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
    },
    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            // Multer will make this file property available on request object
            let filePath;
            if(req.file){
                filePath = req.file.path;
            }
            
            // Validation
            const { error } = productSchema.validate(req.body);

            if (error) {
                // If file passed, must be present as prop in req object
                // Delete the uploaded image file
                // rootfolder/uploads/filename.png
                if(req.file){
                    fs.unlink(`${appRoot}/${filepPath}`, (err) => {
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message));
                        }             
                    });
                }

                return next(error);
            }

            const { name, price, size } = req.body;
            let document;

            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, {new: true}); // So that we get the new updated data
            } catch(err) {
                return next(err);
            }
            
            // Whenever a document is created/saved send 201
            res.status(201).json(document);
        });
    }
}

export default productController;