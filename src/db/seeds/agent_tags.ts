import { db } from '@/db';
import { agentTags } from '@/db/schema';

async function main() {
    const sampleAgentTags = [
        // Agent 1: AI Assistant - Customer Service, Chatbot, NLP
        { agentId: 1, tagId: 1 },
        { agentId: 1, tagId: 5 },
        { agentId: 1, tagId: 8 },
        
        // Agent 2: Code Generator - Automation, Developer Tools, Code Generation
        { agentId: 2, tagId: 2 },
        { agentId: 2, tagId: 12 },
        { agentId: 2, tagId: 15 },
        { agentId: 2, tagId: 20 },
        
        // Agent 3: Data Analyst - Analytics, Business Intelligence, Machine Learning
        { agentId: 3, tagId: 3 },
        { agentId: 3, tagId: 7 },
        { agentId: 3, tagId: 11 },
        
        // Agent 4: Content Writer - Content Creation, NLP, Marketing
        { agentId: 4, tagId: 4 },
        { agentId: 4, tagId: 8 },
        { agentId: 4, tagId: 14 },
        { agentId: 4, tagId: 22 },
        
        // Agent 5: Email Assistant - Automation, Productivity, Email
        { agentId: 5, tagId: 2 },
        { agentId: 5, tagId: 6 },
        { agentId: 5, tagId: 18 },
        
        // Agent 6: Research Bot - Data Mining, Research, Knowledge Base
        { agentId: 6, tagId: 9 },
        { agentId: 6, tagId: 16 },
        { agentId: 6, tagId: 23 },
        { agentId: 6, tagId: 27 },
        
        // Agent 7: Sales Agent - CRM, Lead Generation, Customer Service
        { agentId: 7, tagId: 10 },
        { agentId: 7, tagId: 13 },
        { agentId: 7, tagId: 1 },
        
        // Agent 8: Social Media Manager - Social Media, Marketing, Content Creation
        { agentId: 8, tagId: 17 },
        { agentId: 8, tagId: 14 },
        { agentId: 8, tagId: 4 },
        { agentId: 8, tagId: 22 },
        
        // Agent 9: Voice Assistant - Voice Recognition, NLP, Smart Home
        { agentId: 9, tagId: 19 },
        { agentId: 9, tagId: 8 },
        { agentId: 9, tagId: 25 },
        
        // Agent 10: Translation Bot - Translation, NLP, Communication
        { agentId: 10, tagId: 21 },
        { agentId: 10, tagId: 8 },
        { agentId: 10, tagId: 24 },
        
        // Agent 11: SEO Optimizer - SEO, Marketing, Analytics
        { agentId: 11, tagId: 22 },
        { agentId: 11, tagId: 14 },
        { agentId: 11, tagId: 3 },
        { agentId: 11, tagId: 4 },
        
        // Agent 12: Document Parser - OCR, Document Processing, Automation
        { agentId: 12, tagId: 26 },
        { agentId: 12, tagId: 28 },
        { agentId: 12, tagId: 2 },
        
        // Agent 13: Meeting Scheduler - Calendar, Productivity, Automation
        { agentId: 13, tagId: 29 },
        { agentId: 13, tagId: 6 },
        { agentId: 13, tagId: 2 },
        
        // Agent 14: Sentiment Analyzer - Sentiment Analysis, NLP, Analytics
        { agentId: 14, tagId: 30 },
        { agentId: 14, tagId: 8 },
        { agentId: 14, tagId: 3 },
        { agentId: 14, tagId: 7 },
        
        // Agent 15: Image Recognition - Computer Vision, Machine Learning, Image Processing
        { agentId: 15, tagId: 11 },
        { agentId: 15, tagId: 7 },
        { agentId: 15, tagId: 9 },
        
        // Agent 16: HR Assistant - HR, Automation, Recruitment
        { agentId: 16, tagId: 2 },
        { agentId: 16, tagId: 6 },
        { agentId: 16, tagId: 13 },
        
        // Agent 17: Price Monitor - E-commerce, Analytics, Automation
        { agentId: 17, tagId: 3 },
        { agentId: 17, tagId: 2 },
        { agentId: 17, tagId: 9 },
        
        // Agent 18: Legal Assistant - Legal Tech, Document Processing, Research
        { agentId: 18, tagId: 28 },
        { agentId: 18, tagId: 16 },
        { agentId: 18, tagId: 23 },
        { agentId: 18, tagId: 8 },
        
        // Agent 19: Inventory Manager - Inventory, Automation, Business Intelligence
        { agentId: 19, tagId: 2 },
        { agentId: 19, tagId: 7 },
        { agentId: 19, tagId: 3 },
        
        // Agent 20: Financial Advisor - Finance, Analytics, Machine Learning
        { agentId: 20, tagId: 3 },
        { agentId: 20, tagId: 7 },
        { agentId: 20, tagId: 11 },
        { agentId: 20, tagId: 16 },
        
        // Agent 21: Healthcare Bot - Healthcare, Chatbot, Customer Service
        { agentId: 21, tagId: 5 },
        { agentId: 21, tagId: 1 },
        { agentId: 21, tagId: 8 },
        
        // Agent 22: Bug Tracker - Developer Tools, Automation, Project Management
        { agentId: 22, tagId: 12 },
        { agentId: 22, tagId: 2 },
        { agentId: 22, tagId: 6 },
        
        // Agent 23: Travel Planner - Travel, Automation, Recommendation
        { agentId: 23, tagId: 2 },
        { agentId: 23, tagId: 6 },
        { agentId: 23, tagId: 11 },
        
        // Agent 24: Security Monitor - Security, Monitoring, Automation
        { agentId: 24, tagId: 2 },
        { agentId: 24, tagId: 3 },
        { agentId: 24, tagId: 7 },
        { agentId: 24, tagId: 9 },
    ];

    await db.insert(agentTags).values(sampleAgentTags);
    
    console.log('✅ Agent tags seeder completed successfully - 90 associations created');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});