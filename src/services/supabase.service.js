'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { BadRequestError } from '../core/error.response.js';
import Object3DModel from '../models/3DObject.model.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseBucketName = 'webdev';

class SupabaseService {
    static async upload3DFile(name, description, thumbnailUrl, userId) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const localFilePath = path.join(__dirname, '..', 'uploads', 'temp.glb');
        const fileBuffer = fs.readFileSync(localFilePath); // 👈 đọc file
        // const fileBuffer = fs.readFile(localFilePath);

        const uploadFile = await supabase.storage.from(supabaseBucketName).upload('uploads/temp.glb', fileBuffer, {
            contentType: 'model/gltf-binary',
            cacheControl: '3600',
            upsert: true,
        });

        // if (uploadFile.error) throw new BadRequestError('Cannot upload new 3d file')
        // const { data: urlData, error: urlError } = supabase.storage
        //     .from('webdev')
        //     .getPublicUrl('uploads/uapic_metaspace_archi.glb');
        // if (urlError) throw new BadRequestError('Cannot get url')

        // console.log('url data:: ', urlData)
        // const new3DModelDetail = await Object3DModel.create({
        //     object3d_name: name,
        //     object3d_description: description,
        //     object3d_thumbnailUrl: thumbnailUrl,
        //     object3d_author: userId,
        //     object3d_modelUrl: urlData.publicUrl
        // });
        if (!new3DModelDetail) throw new BadRequestError('Cannot create new 3d File');

        return new3DModelDetail;
        // return duoc url cua thang 3d
    }

    static async getSignedURL({ supabaseFilePath, contentType }) {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const localFilePath = path.join(__dirname, 'uploads', 'temp.glb');
            const fileBuffer = fs.readFileSync(localFilePath); // 👈 đọc file
            // const fileBuffer = fs.readFile(localFilePath);
            console.log(localFilePath);

            const { data, error } = await supabase.storage.from('webdev').upload(supabaseFilePath, fileBuffer, {
                contentType: 'model/gltf+binary',
                cacheControl: '3600',
                upsert: true,
            });

            if (error) throw new BadRequestError(`${error}`);
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from(supabaseBucketName)
                .createSignedUrl(supabaseFilePath, 120, {
                    // URL có hiệu lực trong 60 giây
                    upsert: true, // Không ghi đè nếu file đã tồn tại (false)
                    contentType: contentType,
                });
            console.log(signedUrlData)

            if (signedUrlError) throw new BadRequestError(signedUrlError);


            return {
                url: signedUrlData,
                path: supabaseFilePath,
                type: 'model/gltf+binary',
            };
        } catch (error) {
            throw new BadRequestError(`Error processing request: ${error}`);
        }
    }
}

export default SupabaseService;
