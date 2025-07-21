import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zwkdhictoamyvbodynoy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3a2RoaWN0b2FteXZib2R5bm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MzM5NjksImV4cCI6MjA2ODIwOTk2OX0.75ENSfa7hmwwrOSUEIeR8Qo7jV4kNi9Rx2ShGdBRjj0"; // O 

export const supabase = createClient(supabaseUrl, supabaseKey);
