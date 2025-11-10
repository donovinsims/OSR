import { db } from '@/db';
import { reviews } from '@/db/schema';

async function main() {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const getRandomDate = () => {
        const randomTime = sixtyDaysAgo.getTime() + Math.random() * (now.getTime() - sixtyDaysAgo.getTime());
        return new Date(randomTime).toISOString();
    };
    
    const getRandomRating = () => {
        const rand = Math.random();
        if (rand < 0.5) return 5;
        if (rand < 0.8) return 4;
        return 3;
    };
    
    const reviewTitles = [
        'Excellent AI tool for productivity',
        'Game changer for my workflow',
        'Very helpful and easy to use',
        'Impressive capabilities',
        'Great automation features',
        'Solid performance overall',
        'Saves me hours every week',
        'Perfect for content creation',
        'Really streamlined my process',
        'Highly recommend this agent',
        'Fantastic results so far',
        'Good but could be better',
        'Meets my expectations',
        'Quality tool for the price',
        'Intuitive and powerful',
        'Best AI agent I\'ve tried',
        'Worth every penny',
        'Decent functionality',
        'Works as advertised',
        'Reliable and consistent',
    ];
    
    const reviewBodies = [
        'This AI agent has completely transformed how I approach my daily tasks. The automation features are top-notch and save me countless hours. Highly recommended for anyone looking to boost productivity.',
        'I\'ve been using this for three weeks now and I\'m impressed with the results. It handles complex queries well and the interface is intuitive. Minor bugs here and there but nothing major.',
        'Great tool overall. Does exactly what it promises. The learning curve was minimal and I was up and running within minutes. Customer support is also responsive.',
        'Solid performance and reliable output. I use it daily for content generation and it rarely disappoints. The quality is consistent and it integrates well with my existing workflow.',
        'This agent has become an essential part of my toolkit. The features are well thought out and the execution is smooth. Would love to see more customization options in future updates.',
        'Very satisfied with this purchase. It automates repetitive tasks efficiently and the accuracy is impressive. Saves me about 10 hours per week.',
        'Good value for money. The core functionality works great though some advanced features could use improvement. Overall a positive experience.',
        'I was skeptical at first but this tool proved its worth quickly. The results are professional grade and it handles edge cases better than competitors.',
        'Fantastic AI agent that delivers on its promises. Easy to set up and the documentation is comprehensive. Been using it for two months with great results.',
        'Works well for basic tasks. Does what it says on the tin. Would appreciate more templates and presets but it gets the job done.',
        'Impressive technology behind this agent. The output quality is consistently high and it adapts well to different use cases. Definitely worth trying.',
        'This has streamlined my workflow significantly. The automation capabilities are powerful and the interface is clean. Minor room for improvement but overall excellent.',
        'Reliable tool that I use multiple times per day. It integrates seamlessly with my other tools and the performance is snappy. Very happy with this choice.',
        'Great for content creators and marketers. The AI understands context well and produces relevant results. Has become my go-to solution.',
        'Quality agent with solid features. The learning resources provided are helpful and the community is active. Good investment for professionals.',
        'Does exactly what I need it to do. No frills but very effective. The pricing is fair and the results speak for themselves.',
        'Excellent tool that has exceeded my expectations. The versatility is impressive and it handles complex tasks with ease. Highly recommend.',
        'Good product with room to grow. The core functionality is strong and updates are regular. Looking forward to seeing what comes next.',
        'This agent has made my life so much easier. Quick to deploy and the results are consistently good. Worth every dollar spent.',
        'Solid choice for automation needs. Performance is reliable and the feature set covers most use cases. Happy customer here.',
    ];

    const sampleReviews = [];
    
    for (let i = 0; i < 40; i++) {
        const agentId = Math.floor(Math.random() * 20) + 1;
        const userId = `user_${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`;
        const rating = getRandomRating();
        const createdAt = getRandomDate();
        
        sampleReviews.push({
            agentId,
            userId,
            rating,
            title: reviewTitles[i % reviewTitles.length],
            body: reviewBodies[i % reviewBodies.length],
            createdAt,
            updatedAt: createdAt,
        });
    }
    
    sampleReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    await db.insert(reviews).values(sampleReviews);
    
    console.log('✅ Reviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});