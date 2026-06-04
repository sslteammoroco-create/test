require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Admin Auth (Session Cookie) ─────────────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = '1234';
const COOKIE_NAME = 'jb_admin_session';
const COOKIE_VALUE = 'authenticated_jbgermany_2024';

function isAuthenticated(req) {
    const cookies = req.headers.cookie || '';
    return cookies.split(';').some(c => c.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`);
}

// Show login page
app.get('/admin/login', (req, res) => {
    if (isAuthenticated(req)) return res.redirect('/admin');
    res.sendFile(path.join(__dirname, 'views', 'admin_login.html'));
});

// Handle login form
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.setHeader('Set-Cookie', `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
        return res.redirect('/admin');
    }
    res.redirect('/admin/login?error=1');
});

// Logout
app.get('/admin/logout', (req, res) => {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; Max-Age=0`);
    res.redirect('/admin/login');
});

// Protected dashboard
app.get('/admin', (req, res) => {
    if (!isAuthenticated(req)) return res.redirect('/admin/login');
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// ─── Static Files (after admin routes) ───────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Contact Form API ─────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
    const { fullName, company, email, requestType, details } = req.body;

    if (!fullName || !email || !details) {
        return res.status(400).json({ success: false, message: 'Champs requis manquants.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: `"CNC Tools Store" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `📩 Nouvelle Demande : ${requestType || 'Formulaire de contact'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #001e40; padding: 24px; color: white;">
                    <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">JBGERMANY</h2>
                    <p style="margin: 4px 0 0; color: #a7c8ff; font-size: 13px;">Nouvelle Demande d'Ingénierie</p>
                </div>
                <div style="padding: 32px; background: #f9f9f9;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #515f74; font-size: 12px; text-transform: uppercase; font-weight: bold; width: 40%;">Nom</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #001e40; font-weight: bold;">${fullName}</td></tr>
                        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #515f74; font-size: 12px; text-transform: uppercase; font-weight: bold;">Entreprise</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #001e40;">${company || '—'}</td></tr>
                        <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #515f74; font-size: 12px; text-transform: uppercase; font-weight: bold;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="mailto:${email}" style="color: #003366;">${email}</a></td></tr>
                        <tr><td style="padding: 10px 0; color: #515f74; font-size: 12px; text-transform: uppercase; font-weight: bold;">Type</td><td style="padding: 10px 0; font-size: 14px; color: #001e40;">${requestType || '—'}</td></tr>
                    </table>
                    <div style="margin-top: 24px;">
                        <p style="color: #515f74; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Détails</p>
                        <div style="background: white; border: 1px solid #e0e0e0; padding: 16px; font-size: 14px; color: #1a1c1c; line-height: 1.6;">${details}</div>
                    </div>
                </div>
                <div style="padding: 16px 32px; background: #001e40; color: #a7c8ff; font-size: 11px; text-align: center;">© 2024 JBGERMANY — Message reçu via le formulaire de contact</div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Votre demande a bien été envoyée !' });
    } catch (error) {
        console.error('Email error:', error.message);
        res.status(500).json({ success: false, message: "Erreur lors de l'envoi. Veuillez réessayer." });
    }
});

// ─── Fallback ─────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
});
