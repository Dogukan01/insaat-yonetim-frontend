const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');

router.get('/', auth, async (req, res) => {
    // userId filtresini kaldırdık ki dashboard herkes için dolsun.
    // const userId = req.user.id; 

    try {
        const [
            activeProjects,
            totalEmployees,
            totalBudgetResult,
            completedProjects,
            totalProjects,
            recentActivities
        ] = await Promise.all([
            Project.count({ where: { status: 'Devam Ediyor' } }),
            Employee.count({}),
            Project.sum('budget', {}),
            Project.count({ where: { status: 'Tamamlandı' } }),
            Project.count({}),

            // Son 5 aktiviteyi AuditLog'dan çek
            AuditLog.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'userName', 'action', 'entity', 'description', 'createdAt']
            })
        ]);

        let completionRate = 0;
        if (totalProjects > 0) {
            completionRate = Math.round((completedProjects / totalProjects) * 100);
        }

        res.json({
            activeProjects: activeProjects || 0,
            totalEmployees: totalEmployees || 0,
            totalBudget: totalBudgetResult || 0,
            completionRate: completionRate,
            activities: recentActivities || []
        });

    } catch (err) {
        console.error("Stats API Hatası:", err);
        res.status(500).json({ message: 'İstatistikler alınamadı' });
    }
});

module.exports = router;