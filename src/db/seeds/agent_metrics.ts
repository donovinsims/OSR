import { db } from '@/db';
import { agentMetrics } from '@/db/schema';

async function main() {
    const sampleMetrics = [];
    const today = new Date();
    
    // Generate metrics for agents 1-10 over the last 30 days
    for (let agentId = 1; agentId <= 10; agentId++) {
        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
            const date = new Date(today);
            date.setDate(date.getDate() - dayOffset);
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            // Generate realistic random metrics with variety
            const baseVisits = 50 + Math.floor(Math.random() * 200);
            const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.2;
            const trendingBoost = agentId <= 3 ? 1.5 : 1.0; // First 3 agents are more popular
            
            const visits = Math.floor(baseVisits * weekendMultiplier * trendingBoost);
            const downloads = Math.floor(visits * (0.05 + Math.random() * 0.15)); // 5-20% conversion
            const shares = Math.floor(downloads * (0.1 + Math.random() * 0.3)); // 10-40% of downloads
            
            sampleMetrics.push({
                agentId,
                date: dateString,
                visits: Math.min(500, Math.max(10, visits)),
                downloads: Math.min(50, Math.max(0, downloads)),
                shares: Math.min(20, Math.max(0, shares)),
            });
        }
    }
    
    await db.insert(agentMetrics).values(sampleMetrics);
    
    console.log(`✅ Agent metrics seeder completed successfully - ${sampleMetrics.length} records inserted`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});