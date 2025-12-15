const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const Role = require('../models/Role');
const auth = require('../middleware/auth');
const AuditLogger = require('../utils/auditLogger');

router.get('/', auth, async (req, res) => {
    try {
        const employees = await Employee.findAll({
            // userId filtresi kaldırıldı
            include: [
                { model: Project, attributes: ['id', 'name', 'city', 'district'] },
                { model: Role, attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newEmployee = await Employee.create({
            ...req.body,
            userId: req.user.id
        });

        // Audit Log
        await AuditLogger.logEmployee('CREATE', req.user.id, req.user.name || 'Admin', newEmployee, req);

        res.json(newEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!employee) {
            return res.status(404).json({ message: 'Çalışan bulunamadı' });
        }

        // Değişiklikleri yakala
        let changes = [];
        const newData = req.body;

        if (newData.name && newData.name !== employee.name) {
            changes.push(`İsim: ${employee.name} -> ${newData.name}`);
        }
        if (newData.daily_rate && parseFloat(newData.daily_rate) !== employee.daily_rate) {
            changes.push(`Ücret: ₺${employee.daily_rate} -> ₺${newData.daily_rate}`);
        }

        if (newData.RoleId && parseInt(newData.RoleId) !== employee.RoleId) {
            changes.push(`Görev (Rol) değiştirildi`);
        }
        if (newData.ProjectId !== undefined && newData.ProjectId !== employee.ProjectId) {
            // Null kontrolü de yapalım
            const oldPid = employee.ProjectId;
            const newPid = newData.ProjectId;
            if (oldPid != newPid) changes.push(`Proje ataması değiştirildi`);
        }

        await employee.update(newData);

        res.json(employee);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (employee) {
            await employee.destroy();

            res.json({ message: 'Çalışan silindi' });
        } else {
            res.status(404).json({ message: 'Çalışan bulunamadı' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;