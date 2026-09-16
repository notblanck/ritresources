import { supabase, isSupabaseConfigured } from '../config/supabase.js';
export async function submitContactMessage(req, res, next) {
    try {
        const { name, email, message } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }
        if (!email || !email.trim() || !email.includes('@')) {
            return res.status(400).json({ success: false, message: 'Valid email address is required' });
        }
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message content is required' });
        }
        const payload = {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            created_at: new Date().toISOString()
        };
        if (isSupabaseConfigured() && supabase) {
            const { error } = await supabase.from('contact_messages').insert([payload]);
            if (error) {
                console.warn('Supabase contact insert warning:', error);
            }
        }
        res.status(201).json({
            success: true,
            message: 'Message sent — thanks for reaching out!'
        });
    }
    catch (error) {
        next(error);
    }
}
