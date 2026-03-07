// File: src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// THAY 2 DÒNG DƯỚI BẰNG THÔNG TIN BẠN VỪA COPY Ở BƯỚC 1
const supabaseUrl = "https://cdewocwuuzryyzdxicol.supabase.co";
const supabaseKey = "sb_publishable_XqqEgkBIzB3OR3q-ErI1aw_38aOaux8";

export const supabase = createClient(supabaseUrl, supabaseKey);
