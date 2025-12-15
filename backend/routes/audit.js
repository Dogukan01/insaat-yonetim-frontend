const express = require('express');
const router = express.Router();
const { AuditLog, User, sequelize } = require('../models');
const auth = require('../middleware/auth');

// Tüm audit logları getir (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 50, entity, action, userId } = req.query;
        
        const where = {};
        if (entity) where.entity = entity;
        if (action) where.action = action;
        if (userId) where.userId = userId;

        const logs = await AuditLog.findAll({
            where,
            include: [{ 
                model: User, 
                attributes: ['id', 'name', 'email'],
                required: false
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        const total = await AuditLog.count({ where });

        res.json({
            logs,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        console.error('Audit Log Error:', err);
        res.status(500).json({ message: 'Loglar yüklenemedi' });
    }
});

// İstatistikler
router.get('/stats', auth, async (req, res) => {
    try {
        const stats = await AuditLog.findAll({
            attributes: [
                'entity',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['entity']
        });

        res.json(stats);
    } catch (err) {
        console.error('Stats Error:', err);
        res.status(500).json({ message: 'İstatistikler yüklenemedi' });
    }
});

// Belirli bir kayda ait loglar
router.get('/entity/:entity/:id', auth, async (req, res) => {
    try {
        const { entity, id } = req.params;
        
        const logs = await AuditLog.findAll({
            where: { 
                entity: entity,
                entityId: id 
            },
            include: [{ 
                model: User, 
                attributes: ['id', 'name'],
                required: false
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(logs);
    } catch (err) {
        console.error('Entity Log Error:', err);
        res.status(500).json({ message: 'Loglar yüklenemedi' });
    }
});

module.exports = router;
