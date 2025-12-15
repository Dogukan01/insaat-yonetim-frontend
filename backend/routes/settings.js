const express = require('express');
const router = express.Router();
const { User } = require('../models');
const auth = require('../middleware/auth');

// Basit ayar endpointi - Frontend'de kullanıcı bilgilerini döndür
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        res.json({ user });
    } catch (err) {
        console.error("Settings Get Error:", err);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

module.exports = router;
