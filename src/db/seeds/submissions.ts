import { db } from '@/db';
import { submissions } from '@/db/schema';

async function main() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const getRandomDateInLast30Days = (baseDate: Date) => {
        const dayOffset = Math.floor(Math.random() * 30);
        const date = new Date(baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        return date.toISOString();
    };

    const sampleSubmissions = [
        // Pending submissions
        {
            userId: 'user_050',
            payload: {
                name: 'Customer Support AI Agent',
                description: 'An intelligent AI agent that handles customer inquiries, provides instant responses, and escalates complex issues to human agents when needed.',
                websiteUrl: 'https://customersupport-ai.example.com',
                categoryId: 1
            },
            status: 'pending',
            agentId: null,
            reviewedAt: null,
            reviewerId: null,
            createdAt: getRandomDateInLast30Days(thirtyDaysAgo),
        },
        {
            userId: 'user_051',
            payload: {
                name: 'Data Analytics Assistant',
                description: 'AI-powered analytics agent that processes large datasets, generates insights, and creates visual reports for business intelligence.',
                websiteUrl: 'https://data-analytics-ai.example.com',
                categoryId: 2
            },
            status: 'pending',
            agentId: null,
            reviewedAt: null,
            reviewerId: null,
            createdAt: getRandomDateInLast30Days(thirtyDaysAgo),
        },
        {
            userId: 'user_052',
            payload: {
                name: 'Content Creation Bot',
                description: 'Creative AI agent specialized in generating marketing copy, social media posts, and blog articles with SEO optimization.',
                websiteUrl: 'https://content-creator-ai.example.com',
                categoryId: 3
            },
            status: 'pending',
            agentId: null,
            reviewedAt: null,
            reviewerId: null,
            createdAt: getRandomDateInLast30Days(thirtyDaysAgo),
        },
        // Approved submissions
        {
            userId: 'user_053',
            payload: {
                name: 'Sales Automation Agent',
                description: 'Intelligent sales assistant that qualifies leads, schedules meetings, and provides personalized product recommendations based on customer data.',
                websiteUrl: 'https://sales-automation-ai.example.com',
                categoryId: 1
            },
            status: 'approved',
            agentId: 1,
            reviewedAt: new Date('2024-12-15T10:30:00Z').toISOString(),
            reviewerId: 'admin_001',
            createdAt: new Date('2024-12-10T14:20:00Z').toISOString(),
        },
        {
            userId: 'user_054',
            payload: {
                name: 'Code Review Assistant',
                description: 'AI agent that analyzes code quality, suggests improvements, identifies bugs, and ensures best practices compliance across your codebase.',
                websiteUrl: 'https://code-review-ai.example.com',
                categoryId: 2
            },
            status: 'approved',
            agentId: 2,
            reviewedAt: new Date('2024-12-18T16:45:00Z').toISOString(),
            reviewerId: 'admin_001',
            createdAt: new Date('2024-12-12T09:15:00Z').toISOString(),
        }
    ];

    await db.insert(submissions).values(sampleSubmissions);
    
    console.log('✅ Submissions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});