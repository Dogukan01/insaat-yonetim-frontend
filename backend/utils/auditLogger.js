const AuditLog = require('../models/AuditLog');

/**
 * Audit Log Helper
 * Sistem genelinde tutarlı loglama için kullanılır
 */
class AuditLogger {
    /**
     * Log kaydı oluştur
     * @param {Object} data - Log verisi
     * @param {number} data.userId - Kullanıcı ID
     * @param {string} data.userName - Kullanıcı adı
     * @param {string} data.action - İşlem tipi (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)
     * @param {string} data.entity - Tablo adı (Project, Employee, vb.)
     * @param {number} data.entityId - İşlem yapılan kayıt ID
     * @param {Object} data.changes - Değişiklik detayları
     * @param {Object} data.req - Express request objesi (IP ve User-Agent için)
     * @param {string} data.description - İnsan okunabilir açıklama
     * @param {string} data.status - success, error, warning
     */
    static async log(data) {
        try {
            const logData = {
                userId: data.userId || null,
                userName: data.userName || null,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId || null,
                changes: data.changes || null,
                description: data.description || null,
                status: data.status || 'success',
                ipAddress: data.req ? (data.req.headers['x-forwarded-for'] || data.req.socket.remoteAddress) : null,
                userAgent: data.req ? data.req.headers['user-agent'] : null
            };

            await AuditLog.create(logData);
        } catch (error) {
            // Loglama hatası ana işlemi durdurmamalı
            console.error('Audit Log Error:', error.message);
        }
    }

    /**
     * Proje işlemleri için kısayol
     */
    static async logProject(action, userId, userName, projectData, req, changes = null) {
        const descriptions = {
            'CREATE': `Yeni proje oluşturuldu: "${projectData.name}"`,
            'UPDATE': `Proje güncellendi: "${projectData.name}"`,
            'DELETE': `Proje silindi: "${projectData.name}"`
        };

        await this.log({
            userId,
            userName,
            action,
            entity: 'Project',
            entityId: projectData.id,
            changes,
            description: descriptions[action],
            req
        });
    }

    /**
     * Çalışan işlemleri için kısayol
     */
    static async logEmployee(action, userId, userName, employeeData, req, changes = null) {
        const descriptions = {
            'CREATE': `Yeni çalışan eklendi: "${employeeData.name}"`,
            'UPDATE': `Çalışan güncellendi: "${employeeData.name}"`,
            'DELETE': `Çalışan silindi: "${employeeData.name}"`
        };

        await this.log({
            userId,
            userName,
            action,
            entity: 'Employee',
            entityId: employeeData.id,
            changes,
            description: descriptions[action],
            req
        });
    }

    /**
     * Malzeme işlemleri için kısayol
     */
    static async logMaterial(action, userId, userName, materialData, req, changes = null) {
        const descriptions = {
            'CREATE': `Yeni malzeme eklendi: "${materialData.name}"`,
            'UPDATE': `Malzeme güncellendi: "${materialData.name}"`,
            'TRANSACTION': `Malzeme hareketi: "${materialData.name}" - ${changes?.type} ${changes?.quantity} ${materialData.unit}`
        };

        await this.log({
            userId,
            userName,
            action,
            entity: 'Material',
            entityId: materialData.id,
            changes,
            description: descriptions[action] || `Malzeme işlemi: "${materialData.name}"`,
            req
        });
    }

    /**
     * Ekipman işlemleri için kısayol
     */
    static async logEquipment(action, userId, userName, equipmentData, req, changes = null) {
        const descriptions = {
            'CREATE': `Yeni ekipman eklendi: "${equipmentData.name}"`,
            'UPDATE': `Ekipman güncellendi: "${equipmentData.name}"`,
            'DELETE': `Ekipman silindi: "${equipmentData.name}"`,
            'ASSIGN': `Ekipman projeye atandı: "${equipmentData.name}"`
        };

        await this.log({
            userId,
            userName,
            action,
            entity: 'Equipment',
            entityId: equipmentData.id,
            changes,
            description: descriptions[action],
            req
        });
    }

    /**
     * Giriş/Çıkış logları
     */
    static async logAuth(action, userId, userName, req, status = 'success') {
        const descriptions = {
            'LOGIN': `Kullanıcı giriş yaptı: ${userName}`,
            'LOGOUT': `Kullanıcı çıkış yaptı: ${userName}`,
            'REGISTER': `Yeni kullanıcı kaydı: ${userName}`
        };

        await this.log({
            userId,
            userName,
            action,
            entity: 'User',
            entityId: userId,
            description: descriptions[action],
            status,
            req
        });
    }

    /**
     * Genel işlem logu
     */
    static async logGeneric(action, entity, userId, userName, description, req, changes = null) {
        await this.log({
            userId,
            userName,
            action,
            entity,
            changes,
            description,
            req
        });
    }
}

module.exports = AuditLogger;
