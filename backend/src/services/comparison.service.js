// backend/services/comparison.service.js
import Product from '../models/product.js';
import { geminiModel } from '../utils/geminiClient.js';

class ComparisonService {

    constructor() {
        // Cache for AI verdicts to avoid redundant API calls
        this.aiCache = new Map();
    }

        /**
     * Generate AI verdict using Gemini
     */
    async generateAIVerdict(comparisonResult) {
        // Create a cache key using product IDs
        const ids = [comparisonResult.products[0]._id.toString(), comparisonResult.products[1]._id.toString()].sort();
        const cacheKey = ids.join("-");
                
        // Check if we already have a cached verdict
        if (this.aiCache.has(cacheKey)) {
            console.log('Returning cached AI verdict');
            return this.aiCache.get(cacheKey);
        }

        // Resolve winner name for prompt
        let winnerName = "Tie";
        if (comparisonResult.winner) {
            winnerName = comparisonResult.winner.toString() === comparisonResult.products[0]._id.toString() 
                ? comparisonResult.products[0].name 
                : comparisonResult.products[1].name;
        }

        // Build strict prompt for AI
        const prompt = `
                Write a friendly 2-sentence sustainability comparison using ONLY the data below.

                Product 1: ${comparisonResult.products[0].name}
                Score: ${comparisonResult.scores.product1}
                Advantages: ${comparisonResult.sustainabilityHighlights.product1Advantages.join(", ") || "None"}

                Product 2: ${comparisonResult.products[1].name}
                Score: ${comparisonResult.scores.product2}
                Advantages: ${comparisonResult.sustainabilityHighlights.product2Advantages.join(", ") || "None"}

                Winner: ${winnerName}

                Rules:
                - Do NOT change the winner.
                - Do NOT recalculate scores.
                - Do NOT invent features.
                - Use only the provided advantages.
                `;

        try {
            console.log('Generating AI verdict...');
            const result = await geminiModel.generateContent(prompt);
            const response = await result.response;
            const verdict = response.text().trim();
            
            // Cache the verdict
            this.aiCache.set(cacheKey, verdict);
            
            // Clear cache after 1 hour
            setTimeout(() => {
                this.aiCache.delete(cacheKey);
            }, 60 * 60 * 1000); // 1 hour
            
            return verdict;
        } catch (err) {
            console.error("Gemini AI error:", err);
            
            // Return a fallback message based on winner
            if (comparisonResult.winner) {
                return `Based on sustainability scores, ${winnerName} appears to be the more eco-friendly option with a score of ${
                    winnerName === comparisonResult.products[0].name 
                        ? comparisonResult.scores.product1 
                        : comparisonResult.scores.product2
                } vs ${
                    winnerName === comparisonResult.products[0].name 
                        ? comparisonResult.scores.product2 
                        : comparisonResult.scores.product1
                }.`;
            } else {
                return "Both products have similar sustainability ratings. Consider your specific needs when choosing between them.";
            }
        }
    }

    /** * Calculate sustainability insights based on product attributes * Using Product.js schema fields */
    calculateSustainabilityInsights(product) {
        const advantages = [];
        const suggestions = [];

        // Handle missing sustainability data
        if (!product.sustainability) {
            return { advantages, suggestions };
        }

        // Evaluate sustainability attributes
        if (product.sustainability.recyclableMaterial) advantages.push('Made from recyclable materials');
        else suggestions.push('Consider using recyclable materials');

        if (product.sustainability.biodegradable) advantages.push('Biodegradable');
        else suggestions.push('Look for biodegradable alternatives');

        if (product.sustainability.plasticFree) advantages.push('Plastic-free packaging');
        else suggestions.push('Reduce plastic packaging');

        if (product.sustainability.carbonFootprint < 2) advantages.push('Low carbon footprint');
        else if (product.sustainability.carbonFootprint > 5) suggestions.push('Reduce carbon footprint');

        if (product.sustainability.crueltyFree) advantages.push('Cruelty-free');
        else suggestions.push('Consider cruelty-free certification');

        if (product.sustainability.fairTradeCertified) advantages.push('Fair Trade certified');
        else suggestions.push('Look for Fair Trade certification');

        if (product.sustainability.renewableEnergyUsed) advantages.push('Uses renewable energy');
        else suggestions.push('Switch to renewable energy');

        if (product.sustainability.energyEfficiencyRating >= 4) advantages.push('High energy efficiency');
        else if (product.sustainability.energyEfficiencyRating <= 2) suggestions.push('Improve energy efficiency');

        return { advantages, suggestions };
    }

    /**
     * Generate comparison graph data
     */
    generateComparisonGraphData(product1, product2, score1, score2) {
        const categories = [
            'Recyclable Material',
            'Biodegradable',
            'Plastic Free',
            'Carbon Footprint',
            'Cruelty Free',
            'Fair Trade',
            'Renewable Energy',
            'Energy Efficiency'
        ];

        // Convert sustainability fields to chart values
        const getCategoryValue = (product, category) => {
            if (!product.sustainability) return 0;

            switch(category) {
                case 'Recyclable Material':
                    return product.sustainability.recyclableMaterial ? 20 : 0;
                case 'Biodegradable':
                    return product.sustainability.biodegradable ? 20 : 0;
                case 'Plastic Free':
                    return product.sustainability.plasticFree ? 20 : 0;
                case 'Carbon Footprint':
                    const cf = product.sustainability.carbonFootprint;
                    if (cf < 2) return 20;
                    if (cf < 4) return 15;
                    if (cf < 6) return 10;
                    return 5;
                case 'Cruelty Free':
                    return product.sustainability.crueltyFree ? 20 : 0;
                case 'Fair Trade':
                    return product.sustainability.fairTradeCertified ? 20 : 0;
                case 'Renewable Energy':
                    return product.sustainability.renewableEnergyUsed ? 20 : 0;
                case 'Energy Efficiency':
                    return (product.sustainability.energyEfficiencyRating || 0) * 4;
                default:
                    return 0;
            }
        };

        // Return chart config for frontend
        return {
            labels: categories,
            datasets: [
                {
                    label: product1.name,
                    data: categories.map(cat => getCategoryValue(product1, cat)),
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: product2.name,
                    data: categories.map(cat => getCategoryValue(product2, cat)),
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }
            ]
        };
    }

    /**
     * Compare two products
     */
    async compareProducts(product1, product2) {
        //const score1 = product1.aiSustainablityScore;
        //const score2 = product2.aiSustainablityScore;

        //(prefer sustainabilityScore, fallback to aiSustainablityScore)
        const score1 = product1.sustainabilityScore ?? product1.aiSustainablityScore ?? 0;
        const score2 = product2.sustainabilityScore ?? product2.aiSustainablityScore ?? 0;

        // Determine winner
        let winner = null;
        if (score1 > score2) winner = product1._id;
        else if (score2 > score1) winner = product2._id;

        // Generate sustainability insights
        const product1Insights = this.calculateSustainabilityInsights(product1);
        const product2Insights = this.calculateSustainabilityInsights(product2);

        // 👇 DEBUG LOGS (temporary)
        console.log("Product 1 sustainability insights:", product1Insights);
        console.log("Product 2 sustainability insights:", product2Insights);

        // Generate chart data
        const comparisonGraph = this.generateComparisonGraphData(product1, product2, score1, score2);

        // Build response payload
        const comparisonResult = {
            products: [product1, product2],
            scores: {
            product1: score1,
            product2: score2,
            difference: Math.abs(score1 - score2)
            },
            winner,
            sustainabilityHighlights: {
            product1Advantages: product1Insights.advantages,
            product2Advantages: product2Insights.advantages
            },
            recommendations: {
            product1Suggestions: product1Insights.suggestions,
            product2Suggestions: product2Insights.suggestions
            },
            comparisonGraph
        };

        // Attach AI verdict
        const aiVerdict = await this.generateAIVerdict(comparisonResult);
        comparisonResult.aiVerdict = aiVerdict;

        return comparisonResult;
    }

    /**
     * Save comparison to user history
     */
    async saveComparison(userId, comparisonData) {
        const Comparison = (await import('../models/comparison.js')).default;
        
        const comparison = new Comparison({
            user: userId,
            products: comparisonData.products.map(p => p._id),
            comparisonScore: {
                product1Score: comparisonData.scores.product1,
                product2Score: comparisonData.scores.product2,
                winner: comparisonData.winner,
                scoreDifference: comparisonData.scores.difference
            },
            sustainabilityHighlights: comparisonData.sustainabilityHighlights,
            comparisonGraph: comparisonData.comparisonGraph,
            recommendations: comparisonData.recommendations,
            aiVerdict: comparisonData.aiVerdict 
        });

        await comparison.save();
        return comparison;
    }

    /**
     * Get user's recent comparisons
     */
    async getUserRecentComparisons(userId, limit = 10) {
        const Comparison = (await import('../models/comparison.js')).default;
        
        return await Comparison.find({ user: userId })
            .populate('products')
            .populate('comparisonScore.winner')
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    /**
     * Get comparison by ID
     */
    async getComparisonById(comparisonId) {
        const Comparison = (await import('../models/comparison.js')).default;
        
        return await Comparison.findById(comparisonId)
            .populate('products')
            .populate('comparisonScore.winner');
    }

    /**
     * Get most compared products (for analytics)
     */
    async getMostComparedProducts(limit = 5) {
        const Comparison = (await import('../models/comparison.js')).default;
        
        return await Comparison.aggregate([
            { $unwind: '$products' },
            { $group: { _id: '$products', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
            { 
                $lookup: { 
                    from: 'products', 
                    localField: '_id', 
                    foreignField: '_id', 
                    as: 'productDetails' 
                } 
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    'productDetails.name': 1,
                    'productDetails.brand': 1,
                    'productDetails.category': 1
                }
            }
        ]);
    }
}

export default new ComparisonService();