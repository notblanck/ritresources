import { supabase, isSupabaseConfigured, DEFAULT_DEPARTMENTS } from '../config/supabase.js';
export async function listDepartments(req, res, next) {
    try {
        if (isSupabaseConfigured() && supabase) {
            const { data, error } = await supabase
                .from('departments')
                .select('*')
                .order('display_order', { ascending: true });
            if (!error && data && data.length > 0) {
                return res.json({ success: true, data });
            }
        }
        // Fallback list
        res.json({ success: true, data: DEFAULT_DEPARTMENTS });
    }
    catch (error) {
        next(error);
    }
}
