
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const indianNames = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Aryan", "Krishna", "Atharv",
    "Ishaan", "Dhruv", "Rohan", "Kabir", "Ansh", "Ayaan", "Shaurya", "Ayush", "Siddharth", "Aarush",
    "Rudra", "Om", "Dev", "Yash", "Raghav", "Jay", "Agastya", "Vivaan", "Varun", "Darsh",
    "Kunal", "Rahul", "Samarth", "Nirvaan", "Aadi", "Yuvraj", "Pranav", "Ahmad", "Vihaan", "Rishabh",
    "Ananya", "Aadhya", "Saanvi", "Diya", "Myra", "Kiara", "Pari", "Fatima", "Navya", "Riya",
    "Anaya", "Amaya", "Kavya", "Khushi", "Ayesha", "Siya", "Ira", "Zoya", "Advika", "Prisha",
    "Ahana", "Saira", "Shanaya", "Pihu", "Zara", "Vanya", "Angel", "Amrita", "Nandini", "Bhavya",
    "Rajesh", "Suresh", "Ramesh", "Mahesh", "Dinesh", "Sanjay", "Sunil", "Anil", "Mukesh", "Naresh",
    "Priya", "Sneha", "Pooja", "Neha", "Divya", "Anjali", "Meera", "Swati", "Sonia", "Kiran"
];

const lastNames = [
    "Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Kumar", "Patel", "Shah", "Jain", "Mehta",
    "Reddy", "Nair", "Rao", "Iyer", "Khan", "Ahmed", "Ali", "Siddiqui", "Mishra", "Pandey",
    "Yadav", "Das", "Banerjee", "Chatterjee", "Ghosh", "Bose", "Dutta", "Chopra", "Kapoor", "Khanna",
    "Saxena", "Bhatia", "Arora", "Aggarwal", "Joshi", "Desai", "Kulkarni", "Patil", "Pawar", "Shinde"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat"];

// Hardcoded IDs to ensure consistency
const categories = [
    { name: 'Plumber', slug: 'plumbers', icon: 'Wrench', id: '10000000-0000-0000-0000-000000000101' },
    { name: 'Electrician', slug: 'electricians', icon: 'Zap', id: '10000000-0000-0000-0000-000000000102' },
    { name: 'Carpenter', slug: 'carpenters', icon: 'Hammer', id: '10000000-0000-0000-0000-000000000103' },
    { name: 'Painter', slug: 'painters', icon: 'Paintbrush', id: '10000000-0000-0000-0000-000000000104' },
    { name: 'AC Repair', slug: 'ac-repair', icon: 'Armchair', id: '10000000-0000-0000-0000-000000000105' },
    { name: 'Cleaning', slug: 'cleaning', icon: 'Shirt', id: '10000000-0000-0000-0000-000000000106' },
    { name: 'Salon', slug: 'salon', icon: 'Scissors', id: '10000000-0000-0000-0000-000000000107' },
    { name: 'Massage', slug: 'massage', icon: 'Smile', id: '10000000-0000-0000-0000-000000000108' }
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
    return '9' + Math.floor(Math.random() * 900000000 + 100000000).toString();
}

function escapeSql(str) {
    return str.replace(/'/g, "''");
}

function seed() {
    console.log('Generating SQL seed file...')
    let sqlContent = `-- Generated Mock Data for NeedFul\n\n`;

    // 1. Categories
    sqlContent += `-- Categories\n`;

    // Delete existing categories with these slugs to force insertion with correct UUIDs
    const slugs = categories.map(c => `'${c.slug}'`).join(', ');
    sqlContent += `DELETE FROM public.categories WHERE slug IN (${slugs});\n\n`;

    sqlContent += `INSERT INTO public.categories (id, name, slug, icon, display_order) VALUES\n`;
    const catValues = categories.map((cat, idx) =>
        `('${cat.id}', '${cat.name}', '${cat.slug}', '${cat.icon}', ${idx + 1})`
    ).join(',\n');

    sqlContent += catValues + `\nON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;\n\n`;

    // Dummy User ID
    const dummyUserId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // Insert into auth.users to satisfy FK constraint and trigger public.users creation
    sqlContent += `-- Ensure Dummy Auth User Exists\n`;
    sqlContent += `INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES ('${dummyUserId}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mock_provider@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0123456789', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"name": "Mock Provider"}', NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;\n\n`;

    sqlContent += `-- Ensure Dummy User Exists (in case trigger didn't run or we need to update)\n`;
    sqlContent += `INSERT INTO public.users (id, email, role, created_at) \nVALUES ('${dummyUserId}', 'mock_provider@example.com', 'provider', NOW()) \nON CONFLICT (id) DO UPDATE SET role = 'provider';\n\n`;

    // 2. Providers
    sqlContent += `-- Providers\n`;
    sqlContent += `INSERT INTO public.providers (id, user_id, business_name, slug, description, address, city, phone, whatsapp, email, category_id, is_verified, is_responsive, is_available, operating_hours, rating, review_count, views, created_at) VALUES\n`;

    const providerValues = [];
    const imageValues = [];

    console.log('Generating 500 providers...');

    for (let i = 0; i < 500; i++) {
        const firstName = getRandomItem(indianNames);
        const lastName = getRandomItem(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const cat = getRandomItem(categories);
        const city = getRandomItem(cities);
        const providerId = crypto.randomUUID();

        const isVerified = Math.random() > 0.2;
        const isResponsive = Math.random() > 0.3;

        const slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
        const description = `Professional ${cat.name} with over ${Math.floor(Math.random() * 10) + 2} years of experience. Specializing in all kinds of ${cat.name} works. Reliable and affordable.`.replace(/'/g, "''");
        const address = `${Math.floor(Math.random() * 100) + 1}, ${getRandomItem(['Main Road', 'Market', 'Colony', 'Nagar', 'Street'])}`;
        const phone = generatePhone();
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Math.floor(Math.random() * 1000)}@example.com`;

        providerValues.push(
            `('${providerId}', '${dummyUserId}', '${escapeSql(fullName)}', '${slug}', '${escapeSql(description)}', '${escapeSql(address)}', '${city}', '${phone}', '${phone}', '${email}', '${cat.id}', ${isVerified}, ${isResponsive}, true, '9:00 AM - 8:00 PM', ${parseFloat((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1))}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 1000)}, NOW())`
        );

        // Images
        const numImages = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numImages; j++) {
            const imgId = Math.floor(Math.random() * 70);
            imageValues.push(
                `('${crypto.randomUUID()}', '${providerId}', 'https://i.pravatar.cc/300?img=${imgId + j}', ${j}, ${j === 0})`
            );
        }
    }

    sqlContent += providerValues.join(',\n') + ';\n\n';

    // 3. Images
    sqlContent += `-- Provider Images\n`;
    sqlContent += `INSERT INTO public.provider_images (id, provider_id, url, display_order, is_primary) VALUES\n`;
    sqlContent += imageValues.join(',\n') + ';\n';

    const outputPath = path.resolve(process.cwd(), 'seed_mock_data.sql');
    fs.writeFileSync(outputPath, sqlContent);
    console.log(`SQL seed file generated at: ${outputPath}`);
}

seed();
