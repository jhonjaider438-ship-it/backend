import dotenv from 'dotenv/config';
import { createClient } from '@supabase/supabase-js'

// creacion e la coneccion a supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

//variables de coneccion
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ error en variables de entorno');
    process.exit(1);
}

// coneccion a supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

export const conectaDB=()=>{
    console.log('coneccion a la base de datos establecidamente correctamente');
}