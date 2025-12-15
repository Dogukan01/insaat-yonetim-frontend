// Veritabanı temizleme ve senkronizasyon
const { sequelize } = require('./config/db');
const models = require('./models');

async function cleanDatabase() {
    try {
        console.log('🔍 Veritabanı bağlantısı kuruluyor...');
        await sequelize.authenticate();
        console.log('✅ Bağlantı başarılı!');

        // Tüm mevcut tabloları al
        const queryInterface = sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();
        
        console.log('\n📋 Mevcut tablolar:');
        console.log(tables);

        // Kullanılmayan tablolar
        const unusedTables = [
            'Activities',
            'SecurityLogs', 
            'Settings',
            'settings', // lowercase de dene
            'SiteDiaries',
            'ProjectTasks',
            'MaterialTransactions'
        ];

        console.log('\n🗑️  Kullanılmayan tablolar siliniyor...');
        for (const table of unusedTables) {
            if (tables.includes(table)) {
                await queryInterface.dropTable(table);
                console.log(`   ❌ ${table} silindi`);
            } else {
                console.log(`   ℹ️  ${table} zaten yok`);
            }
        }

        console.log('\n🔄 Model senkronizasyonu yapılıyor...');
        await sequelize.sync({ alter: true });
        console.log('✅ Senkronizasyon tamamlandı!');

        console.log('\n📊 Güncel tablolar:');
        const newTables = await queryInterface.showAllTables();
        console.log(newTables);

        console.log('\n✨ İşlem başarıyla tamamlandı!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

cleanDatabase();
