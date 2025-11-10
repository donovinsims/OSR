import { db } from '@/db';
import { tags } from '@/db/schema';

async function main() {
    const sampleTags = [
        {
            name: 'Chatbot',
            slug: 'chatbot',
            createdAt: new Date('2024-01-05').toISOString(),
        },
        {
            name: 'NLP',
            slug: 'nlp',
            createdAt: new Date('2024-01-05').toISOString(),
        },
        {
            name: 'Machine Learning',
            slug: 'machine-learning',
            createdAt: new Date('2024-01-06').toISOString(),
        },
        {
            name: 'Computer Vision',
            slug: 'computer-vision',
            createdAt: new Date('2024-01-06').toISOString(),
        },
        {
            name: 'Voice Assistant',
            slug: 'voice-assistant',
            createdAt: new Date('2024-01-07').toISOString(),
        },
        {
            name: 'Automation',
            slug: 'automation',
            createdAt: new Date('2024-01-07').toISOString(),
        },
        {
            name: 'API',
            slug: 'api',
            createdAt: new Date('2024-01-08').toISOString(),
        },
        {
            name: 'Customer Service',
            slug: 'customer-service',
            createdAt: new Date('2024-01-08').toISOString(),
        },
        {
            name: 'Data Processing',
            slug: 'data-processing',
            createdAt: new Date('2024-01-09').toISOString(),
        },
        {
            name: 'Content Writing',
            slug: 'content-writing',
            createdAt: new Date('2024-01-09').toISOString(),
        },
        {
            name: 'Code Generation',
            slug: 'code-generation',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Image Generation',
            slug: 'image-generation',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            name: 'Analytics',
            slug: 'analytics',
            createdAt: new Date('2024-01-11').toISOString(),
        },
        {
            name: 'Recommendation',
            slug: 'recommendation',
            createdAt: new Date('2024-01-11').toISOString(),
        },
        {
            name: 'Real-time',
            slug: 'real-time',
            createdAt: new Date('2024-01-12').toISOString(),
        },
        {
            name: 'Multi-language',
            slug: 'multi-language',
            createdAt: new Date('2024-01-12').toISOString(),
        },
        {
            name: 'Integration',
            slug: 'integration',
            createdAt: new Date('2024-01-13').toISOString(),
        },
        {
            name: 'Cloud-based',
            slug: 'cloud-based',
            createdAt: new Date('2024-01-13').toISOString(),
        },
        {
            name: 'Open Source',
            slug: 'open-source',
            createdAt: new Date('2024-01-14').toISOString(),
        },
        {
            name: 'Enterprise',
            slug: 'enterprise',
            createdAt: new Date('2024-01-14').toISOString(),
        },
        {
            name: 'E-commerce',
            slug: 'ecommerce',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Healthcare',
            slug: 'healthcare',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            name: 'Finance',
            slug: 'finance',
            createdAt: new Date('2024-01-16').toISOString(),
        },
        {
            name: 'Education',
            slug: 'education',
            createdAt: new Date('2024-01-16').toISOString(),
        },
        {
            name: 'Marketing',
            slug: 'marketing',
            createdAt: new Date('2024-01-17').toISOString(),
        },
        {
            name: 'HR',
            slug: 'hr',
            createdAt: new Date('2024-01-17').toISOString(),
        },
        {
            name: 'Conversational',
            slug: 'conversational',
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            name: 'Workflow',
            slug: 'workflow',
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            name: 'Sentiment Analysis',
            slug: 'sentiment-analysis',
            createdAt: new Date('2024-01-19').toISOString(),
        },
        {
            name: 'Personalization',
            slug: 'personalization',
            createdAt: new Date('2024-01-19').toISOString(),
        }
    ];

    await db.insert(tags).values(sampleTags);
    
    console.log('✅ Tags seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});