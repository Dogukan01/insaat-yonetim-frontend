// Full Database Reset & Seed Script
const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetDatabase() {
    try {
        console.log('\n🔥 FULL DATABASE RESET BAŞLIYOR...\n');
        
        // Bağlantı testi
        await sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı\n');

        // TÜM TABLOLARI VE CONSTRAINT'LERİ SİL
        console.log('🗑️  Tüm tablolar ve kısıtlamalar siliniyor...');
        
        // Önce tüm constraint'leri temizle
        await sequelize.query(`
            DO $$ 
            DECLARE r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        `);
        
        console.log('✅ Tüm tablolar silindi\n');

        // Modelleri içe aktar (sync'ten önce!)
        const models = require('./models');

        // TABLOLARI YENİDEN OLUŞTUR
        console.log('🔨 Tablolar yeniden oluşturuluyor...');
        await sequelize.sync({ force: true });
        console.log('✅ Tablolar oluşturuldu\n');

        const { User, Project, Employee, Role, Attendance, Expense, Supplier, Material, Equipment, Document, AuditLog } = models;

        console.log('📦 BULK INSERT başlıyor...\n');

        // ==================== 1. KULLANICILAR ====================
        console.log('👤 Kullanıcılar ekleniyor...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const users = await User.bulkCreate([
            {
                name: 'Admin User',
                email: 'admin@insaat.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            },
            {
                name: 'Ahmet Yılmaz',
                email: 'ahmet@insaat.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            }
        ]);
        console.log(`✅ ${users.length} kullanıcı eklendi\n`);

        const adminUser = users[0];

        // ==================== 2. ROLLER ====================
        console.log('💼 Roller ekleniyor...');
        const roles = await Role.bulkCreate([
            { name: 'Şantiye Şefi', default_daily_rate: 850, userId: adminUser.id },
            { name: 'Mimar', default_daily_rate: 750, userId: adminUser.id },
            { name: 'İnşaat Mühendisi', default_daily_rate: 700, userId: adminUser.id },
            { name: 'Elektrik Ustası', default_daily_rate: 600, userId: adminUser.id },
            { name: 'Sıhhi Tesisat Ustası', default_daily_rate: 550, userId: adminUser.id },
            { name: 'Kalıpçı Ustası', default_daily_rate: 500, userId: adminUser.id },
            { name: 'Demir Ustası', default_daily_rate: 480, userId: adminUser.id },
            { name: 'Duvarcı', default_daily_rate: 450, userId: adminUser.id },
            { name: 'Sıvacı', default_daily_rate: 420, userId: adminUser.id },
            { name: 'Boyacı', default_daily_rate: 400, userId: adminUser.id },
            { name: 'İşçi', default_daily_rate: 350, userId: adminUser.id },
            { name: 'Güvenlik Görevlisi', default_daily_rate: 380, userId: adminUser.id },
            { name: 'Temizlik Görevlisi', default_daily_rate: 320, userId: adminUser.id }
        ]);
        console.log(`✅ ${roles.length} rol eklendi\n`);

        // ==================== 3. PROJELER ====================
        console.log('🏗️  Projeler ekleniyor...');
        const projects = await Project.bulkCreate([
            {
                name: 'Lale Residence Konut Projesi',
                description: 'Kadıköy bölgesinde 8 katlı, 32 daireli lüks konut projesi',
                city: 'İstanbul',
                district: 'Kadıköy',
                address: 'Caferağa Mahallesi, Moda Caddesi No: 45',
                budget: 18500000,
                currency: 'TRY',
                start_date: new Date('2024-06-01'),
                end_date: new Date('2026-03-31'),
                status: 'Devam Ediyor',
                userId: adminUser.id
            },
            {
                name: 'Boğaz View İş Merkezi',
                description: '20 katlı A+ ofis binası, Boğaz manzaralı',
                city: 'İstanbul',
                district: 'Beşiktaş',
                address: 'Levent Mahallesi, Büyükdere Caddesi No: 201',
                budget: 45000000,
                currency: 'TRY',
                start_date: new Date('2024-03-15'),
                end_date: new Date('2027-12-31'),
                status: 'Devam Ediyor',
                userId: adminUser.id
            },
            {
                name: 'Sarıyer Villaları',
                description: '12 adet müstakil villa projesi',
                city: 'İstanbul',
                district: 'Sarıyer',
                address: 'Tarabya Mahallesi, Kireçburnu Yolu No: 34',
                budget: 28000000,
                currency: 'TRY',
                start_date: new Date('2023-09-01'),
                end_date: new Date('2025-08-30'),
                status: 'Devam Ediyor',
                userId: adminUser.id
            },
            {
                name: 'Zekeriyaköy Sitesi',
                description: '240 daireli kapalı site projesi',
                city: 'İstanbul',
                district: 'Sarıyer',
                budget: 52000000,
                currency: 'TRY',
                start_date: new Date('2024-01-10'),
                status: 'Planlama',
                userId: adminUser.id
            }
        ]);
        console.log(`✅ ${projects.length} proje eklendi\n`);

        // ==================== 4. ÇALIŞANLAR ====================
        console.log('👷 Çalışanlar ekleniyor...');
        const employees = await Employee.bulkCreate([
            {
                name: 'Mehmet Demir',
                phone: '0532 111 2233',
                email: 'mehmet@example.com',
                address: 'Kadıköy, İstanbul',
                daily_rate: 850,
                status: 'Aktif',
                RoleId: roles[0].id, // Şantiye Şefi
                ProjectId: projects[0].id,
                userId: adminUser.id
            },
            {
                name: 'Ali Yılmaz',
                phone: '0533 222 3344',
                email: 'ali@example.com',
                address: 'Beşiktaş, İstanbul',
                daily_rate: 750,
                status: 'Aktif',
                RoleId: roles[1].id, // Mimar
                ProjectId: projects[1].id,
                userId: adminUser.id
            },
            {
                name: 'Ayşe Kaya',
                phone: '0534 333 4455',
                email: 'ayse@example.com',
                address: 'Sarıyer, İstanbul',
                daily_rate: 700,
                status: 'Aktif',
                RoleId: roles[2].id, // İnşaat Mühendisi
                ProjectId: projects[0].id,
                userId: adminUser.id
            },
            {
                name: 'Fatma Şahin',
                phone: '0535 444 5566',
                daily_rate: 600,
                status: 'Aktif',
                RoleId: roles[3].id, // Elektrik Ustası
                ProjectId: projects[1].id,
                userId: adminUser.id
            },
            {
                name: 'Mustafa Öz',
                phone: '0536 555 6677',
                daily_rate: 550,
                status: 'Aktif',
                RoleId: roles[4].id, // Sıhhi Tesisat
                ProjectId: projects[2].id,
                userId: adminUser.id
            },
            {
                name: 'Hasan Çelik',
                phone: '0537 666 7788',
                daily_rate: 500,
                status: 'Aktif',
                RoleId: roles[5].id, // Kalıpçı
                ProjectId: projects[0].id,
                userId: adminUser.id
            },
            {
                name: 'Zeynep Arslan',
                phone: '0538 777 8899',
                daily_rate: 450,
                status: 'Aktif',
                RoleId: roles[7].id, // Duvarcı
                ProjectId: projects[1].id,
                userId: adminUser.id
            },
            {
                name: 'Emre Aydın',
                phone: '0539 888 9900',
                daily_rate: 420,
                status: 'Aktif',
                RoleId: roles[8].id, // Sıvacı
                ProjectId: projects[0].id,
                userId: adminUser.id
            }
        ]);
        console.log(`✅ ${employees.length} çalışan eklendi\n`);

        // ==================== 5. YOKLAMA ====================
        console.log('📅 Yoklamalar ekleniyor...');
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const attendances = await Attendance.bulkCreate([
            { date: today, status: 'Geldi', EmployeeId: employees[0].id, ProjectId: projects[0].id, userId: adminUser.id },
            { date: today, status: 'Geldi', EmployeeId: employees[1].id, ProjectId: projects[1].id, userId: adminUser.id },
            { date: today, status: 'Geldi', EmployeeId: employees[2].id, ProjectId: projects[0].id, userId: adminUser.id },
            { date: today, status: 'İzinli', EmployeeId: employees[3].id, ProjectId: projects[1].id, userId: adminUser.id },
            { date: today, status: 'Geldi', EmployeeId: employees[4].id, ProjectId: projects[2].id, userId: adminUser.id },
            { date: yesterday, status: 'Geldi', EmployeeId: employees[0].id, ProjectId: projects[0].id, userId: adminUser.id },
            { date: yesterday, status: 'Geldi', EmployeeId: employees[1].id, ProjectId: projects[1].id, userId: adminUser.id },
            { date: yesterday, status: 'Gelmedi', EmployeeId: employees[3].id, ProjectId: projects[1].id, userId: adminUser.id },
        ]);
        console.log(`✅ ${attendances.length} yoklama kaydı eklendi\n`);

        // ==================== 6. HARCAMALAR ====================
        console.log('💰 Harcamalar ekleniyor...');
        const expenses = await Expense.bulkCreate([
            {
                description: 'Demir malzeme alımı',
                amount: 125000,
                category: 'Malzeme',
                date: new Date('2024-11-15'),
                ProjectId: projects[0].id,
                userId: adminUser.id
            },
            {
                description: 'Çimento ve kum',
                amount: 45000,
                category: 'Malzeme',
                date: new Date('2024-11-18'),
                ProjectId: projects[0].id,
                userId: adminUser.id
            },
            {
                description: 'Elektrik tesisatı',
                amount: 78000,
                category: 'İşçilik',
                date: new Date('2024-11-20'),
                ProjectId: projects[1].id,
                userId: adminUser.id
            },
            {
                description: 'Vinç kiralama',
                amount: 35000,
                category: 'Ekipman',
                date: new Date('2024-11-10'),
                ProjectId: projects[1].id,
                userId: adminUser.id
            },
            {
                description: 'İşçi maaşları',
                amount: 250000,
                category: 'İşçilik',
                date: new Date('2024-11-01'),
                ProjectId: projects[0].id,
                userId: adminUser.id
            }
        ]);
        console.log(`✅ ${expenses.length} harcama kaydı eklendi\n`);

        // ==================== 7. TEDARİKÇİLER ====================
        console.log('🏢 Tedarikçiler ekleniyor...');
        const suppliers = await Supplier.bulkCreate([
            {
                name: 'İnşaat Demir A.Ş.',
                contact_person: 'Ahmet Yıldız',
                phone: '0212 555 1111',
                email: 'info@insaatdemir.com',
                address: 'Kağıthane, İstanbul',
                tax_number: '1234567890',
                payment_terms: '30 gün vadeli',
                rating: 5,
                isActive: true,
                userId: adminUser.id
            },
            {
                name: 'Çimento & Kum Ltd.',
                contact_person: 'Mehmet Akar',
                phone: '0216 444 2222',
                email: 'satis@cimentokum.com',
                address: 'Pendik, İstanbul',
                tax_number: '0987654321',
                payment_terms: '15 gün vadeli',
                rating: 4,
                isActive: true,
                userId: adminUser.id
            },
            {
                name: 'Elektrik Malzemeleri San.',
                contact_person: 'Fatma Şen',
                phone: '0532 777 3333',
                email: 'info@elektrikmal.com',
                address: 'Ümraniye, İstanbul',
                payment_terms: 'Peşin',
                rating: 5,
                isActive: true,
                userId: adminUser.id
            }
        ]);
        console.log(`✅ ${suppliers.length} tedarikçi eklendi\n`);

        // ==================== 8. MALZEMELER ====================
        console.log('📦 Malzemeler ekleniyor...');
        const materials = await Material.bulkCreate([
            {
                name: 'Demir 12mm',
                category: 'İnşaat Demiri',
                unit: 'Ton',
                stock_quantity: 15.5,
                minimum_stock: 5,
                unit_price: 28500,
                SupplierId: suppliers[0].id,
                userId: adminUser.id
            },
            {
                name: 'Demir 16mm',
                category: 'İnşaat Demiri',
                unit: 'Ton',
                stock_quantity: 8.2,
                minimum_stock: 3,
                unit_price: 29200,
                SupplierId: suppliers[0].id,
                userId: adminUser.id
            },
            {
                name: 'Çimento',
                category: 'Bağlayıcı',
                unit: 'Ton',
                stock_quantity: 45,
                minimum_stock: 20,
                unit_price: 3250,
                SupplierId: suppliers[1].id,
                userId: adminUser.id
            },
            {
                name: 'Kum',
                category: 'Agrega',
                unit: 'm³',
                stock_quantity: 120,
                minimum_stock: 50,
                unit_price: 180,
                SupplierId: suppliers[1].id,
                userId: adminUser.id
            },
            {
                name: 'Elektrik Kablosu 2.5mm',
                category: 'Elektrik',
                unit: 'Metre',
                stock_quantity: 2500,
                minimum_stock: 500,
                unit_price: 12.5,
                SupplierId: suppliers[2].id,
                userId: adminUser.id
            },
            {
                name: 'Boya (İç Cephe)',
                category: 'Boya',
                unit: 'Litre',
                stock_quantity: 450,
                minimum_stock: 100,
                unit_price: 85,
                userId: adminUser.id
            }
        ]);
        console.log(`✅ ${materials.length} malzeme eklendi\n`);

        // ==================== 9. EKİPMAN ====================
        console.log('🚜 Ekipmanlar ekleniyor...');
        const equipment = await Equipment.bulkCreate([
            {
                name: 'Vinç - Kule Tipi 40m',
                type: 'Vinç',
                serial_number: 'VNC-2021-001',
                purchase_date: new Date('2021-05-15'),
                purchase_price: 1250000,
                daily_rental_cost: 5500,
                condition: 'İyi',
                location: 'Lale Residence Şantiyesi',
                isAvailable: false,
                userId: adminUser.id
            },
            {
                name: 'Ekskavatör CAT 320',
                type: 'Ekskavatör',
                serial_number: 'EKS-2020-045',
                purchase_date: new Date('2020-08-10'),
                purchase_price: 850000,
                daily_rental_cost: 3200,
                condition: 'Mükemmel',
                location: 'Depo',
                isAvailable: true,
                userId: adminUser.id
            },
            {
                name: 'Kamyon - Mercedes 3232',
                type: 'Kamyon',
                serial_number: 'KMY-2022-012',
                purchase_date: new Date('2022-03-20'),
                purchase_price: 1500000,
                daily_rental_cost: 2800,
                condition: 'İyi',
                location: 'Boğaz View Şantiyesi',
                isAvailable: false,
                userId: adminUser.id
            },
            {
                name: 'Forklift 3 Ton',
                type: 'Forklift',
                serial_number: 'FRK-2019-089',
                purchase_price: 180000,
                daily_rental_cost: 850,
                condition: 'Orta',
                location: 'Depo',
                isAvailable: true,
                userId: adminUser.id
            }
        ]);
        console.log(`✅ ${equipment.length} ekipman eklendi\n`);

        // ==================== 10. DÖKÜMANLAR ====================
        console.log('📄 Dökümanlar ekleniyor...');
        const documents = await Document.bulkCreate([
            {
                title: 'İnşaat Ruhsatı',
                type: 'Ruhsat',
                file_name: 'insaat_ruhsati_2024.pdf',
                file_size: 2048000,
                description: 'Belediye onaylı inşaat ruhsatı',
                ProjectId: projects[0].id,
                uploaded_by: adminUser.id
            },
            {
                title: 'Mimari Proje',
                type: 'Plan/Proje',
                file_name: 'mimari_proje_v3.dwg',
                file_size: 8192000,
                description: 'Onaylı mimari proje dosyası',
                ProjectId: projects[0].id,
                uploaded_by: adminUser.id
            },
            {
                title: 'Yapı Kullanma İzni',
                type: 'Ruhsat',
                file_name: 'yapi_kullanma.pdf',
                file_size: 1536000,
                ProjectId: projects[1].id,
                uploaded_by: adminUser.id
            }
        ]);
        console.log(`✅ ${documents.length} döküman eklendi\n`);

        // ==================== 11. AUDIT LOG ====================
        console.log('📝 Audit logları ekleniyor...');
        const auditLogs = await AuditLog.bulkCreate([
            {
                userId: adminUser.id,
                userName: adminUser.name,
                action: 'LOGIN',
                entity: 'User',
                entityId: adminUser.id,
                description: 'Sistem yöneticisi giriş yaptı',
                ipAddress: '127.0.0.1',
                status: 'success'
            },
            {
                userId: adminUser.id,
                userName: adminUser.name,
                action: 'CREATE',
                entity: 'Project',
                entityId: projects[0].id,
                description: `Yeni proje oluşturuldu: "${projects[0].name}"`,
                status: 'success'
            }
        ]);
        console.log(`✅ ${auditLogs.length} audit log eklendi\n`);

        // ÖZET
        console.log('\n' + '='.repeat(60));
        console.log('✨ VERİTABANI BAŞARIYLA OLUŞTURULDU VE DOLDURULDU! ✨');
        console.log('='.repeat(60));
        console.log(`
📊 ÖZET:
   • ${users.length} Kullanıcı
   • ${roles.length} Rol
   • ${projects.length} Proje
   • ${employees.length} Çalışan
   • ${attendances.length} Yoklama kaydı
   • ${expenses.length} Harcama kaydı
   • ${suppliers.length} Tedarikçi
   • ${materials.length} Malzeme
   • ${equipment.length} Ekipman
   • ${documents.length} Döküman
   • ${auditLogs.length} Audit Log

🔑 GİRİŞ BİLGİLERİ:
   Email: admin@insaat.com
   Şifre: admin123

🚀 Backend'i başlatabilirsiniz: npm run dev
        `);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ HATA:', error);
        console.error('\nDetaylar:', error.message);
        process.exit(1);
    }
}

// Script'i çalıştır
resetDatabase();
