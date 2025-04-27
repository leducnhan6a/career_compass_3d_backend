'use strict'

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'


dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY


class SupabaseService { 
    static async upload3DFile() { 
        const supabase = createClient(supabaseUrl, supabaseKey);

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // return duoc url cua thang 3d
    }
}

export default SupabaseService