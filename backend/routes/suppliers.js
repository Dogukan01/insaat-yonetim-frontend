const express = require('express');
const router = express.Router();
const { Supplier, Material } = require('../models');
const auth = require('../middleware/auth');

// Tüm tedarikçileri getir
router.get('/', auth, async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            include: [{ model: Material, attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(suppliers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Yeni tedarikçi ekle
router.post('/', auth, async (req, res) => {
    try {
        const supplier = await Supplier.create({
            ...req.body,
            userId: req.user.id
        });
        res.json(supplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Tedarikçi güncelle
router.put('/:id', auth, async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Tedarikçi bulunamadı' });
        }
        await supplier.update(req.body);
        res.json(supplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Tedarikçi sil
router.delete('/:id', auth, async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Tedarikçi bulunamadı' });
        }
        await supplier.destroy();
        res.json({ message: 'Tedarikçi silindi' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;
