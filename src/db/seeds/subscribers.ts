import { db } from '@/db';
import { subscribers } from '@/db/schema';

async function main() {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const sampleSubscribers = [
        {
            email: 'john.developer@gmail.com',
            source: 'homepage',
            createdAt: new Date(sixtyDaysAgo.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'sarah.tech@outlook.com',
            source: 'footer',
            createdAt: new Date(sixtyDaysAgo.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'mike.johnson@company.io',
            source: 'modal',
            createdAt: new Date(sixtyDaysAgo.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'emma.wilson@startup.dev',
            source: 'api',
            createdAt: new Date(sixtyDaysAgo.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'alex.martinez@tech.com',
            source: 'homepage',
            createdAt: new Date(sixtyDaysAgo.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'lisa.chen@example.com',
            source: 'footer',
            createdAt: new Date(sixtyDaysAgo.getTime() + 38 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'david.brown@developer.net',
            source: 'modal',
            createdAt: new Date(sixtyDaysAgo.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'rachel.davis@test.com',
            source: 'api',
            createdAt: new Date(sixtyDaysAgo.getTime() + 50 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'james.miller@codebase.io',
            source: 'homepage',
            createdAt: new Date(sixtyDaysAgo.getTime() + 55 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            email: 'sophia.anderson@webdev.com',
            source: 'footer',
            createdAt: new Date(sixtyDaysAgo.getTime() + 58 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(subscribers).values(sampleSubscribers);
    
    console.log('✅ Subscribers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});