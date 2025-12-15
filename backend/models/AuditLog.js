const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'İşlemi yapan kullanıcı'
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Kullanıcı silinirse adı burada kalsın'
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'CREATE, UPDATE, DELETE, LOGIN, LOGOUT'
    },
    entity: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Hangi tablo: Project, Employee, Material, vb.'
    },
    entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'İşlem yapılan kaydın ID\'si'
    },
    changes: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Değişiklik detayları (öncesi/sonrası)'
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Tarayıcı ve cihaz bilgisi'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'İnsan okunabilir açıklama'
    },
    status: {
        type: DataTypes.ENUM('success', 'error', 'warning'),
        defaultValue: 'success'
    }
}, {
    timestamps: true,
    updatedAt: false, // Audit log güncellenmez, sadece oluşturulur
    indexes: [
        { fields: ['userId'] },
        { fields: ['entity'] },
        { fields: ['action'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = AuditLog;
