import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Customer Support',
            slug: 'customer-support',
            description: 'AI agents for customer service and support automation',
            icon: '🎧',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Coding & Dev',
            slug: 'coding-dev',
            description: 'Development and coding assistants',
            icon: '💻',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            name: 'Content Creation',
            slug: 'content-creation',
            description: 'Writing, editing, and content generation',
            icon: '✍️',
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            name: 'Data Analysis',
            slug: 'data-analysis',
            description: 'Analytics and data processing agents',
            icon: '📊',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            name: 'Sales & Marketing',
            slug: 'sales-marketing',
            description: 'Marketing automation and sales tools',
            icon: '📈',
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-14').toISOString(),
        },
        {
            name: 'Productivity',
            slug: 'productivity',
            description: 'Task management and productivity tools',
            icon: '⚡',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Education',
            slug: 'education',
            description: 'Learning and educational assistants',
            icon: '🎓',
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            name: 'Research',
            slug: 'research',
            description: 'Research and information gathering',
            icon: '🔬',
            createdAt: new Date('2024-01-17').toISOString(),
            updatedAt: new Date('2024-01-17').toISOString(),
        },
        {
            name: 'Design',
            slug: 'design',
            description: 'Design and creative tools',
            icon: '🎨',
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            name: 'Finance',
            slug: 'finance',
            description: 'Financial analysis and management',
            icon: '💰',
            createdAt: new Date('2024-01-19').toISOString(),
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        {
            name: 'HR & Ops',
            slug: 'hr-ops',
            description: 'Human resources and operations',
            icon: '👥',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            name: 'Misc',
            slug: 'misc',
            description: 'Miscellaneous and other categories',
            icon: '🔧',
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});