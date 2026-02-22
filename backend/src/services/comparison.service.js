// backend/services/comparison.service.js
import Product from '../models/Product.js';

class ComparisonService {
    
    /**
     * Calculate sustainability score based on product attributes
     * Using your Product.js schema fields
     */
    calculateSustainabilityScore(product) {
        let score = 0;
        const advantages = [];
        const suggestions = [];

        // Check if product has sustainability data
        if (!product.sustainability) {
            return { score: 0, advantages: [], suggestions: [] };
        }

        // Recyclable Material
        if (product.sustainability.recyclableMaterial) {
            score += 15;
            advantages.push('✅ Made from recyclable materials');
        } else {
            suggestions.push('♻️ Consider using recyclable materials');
        }

        // Biodegradable
        if (product.sustainability.biodegradable) {
            score += 15;
            advantages.push('✅ Product is biodegradable');
        } else {
            suggestions.push('🌱 Look for biodegradable alternatives');
        }

        // Plastic Free
        if (product.sustainability.plasticFree) {
            score += 20;
            advantages.push('✅ Plastic-free packaging');
        } else {
            suggestions.push('🛍️ Reduce plastic packaging');
        }

        // Carbon Footprint (lower is better)
        if (product.sustainability.carbonFootprint) {
            if (product.sustainability.carbonFootprint < 2) {
                score += 25;
                advantages.push('✅ Excellent carbon footprint (low emissions)');
            } else if (product.sustainability.carbonFootprint < 4) {
                score += 15;
                advantages.push('✅ Good carbon footprint');
            } else if (product.sustainability.carbonFootprint < 6) {
                score += 10;
                advantages.push('⚡ Average carbon footprint');
            } else {
                suggestions.push('🌍 High carbon footprint - consider reducing emissions');
            }
        }

        // Cruelty Free
        if (product.sustainability.crueltyFree) {
            score += 15;
            advantages.push('✅ Cruelty-free certified');
        } else {
            suggestions.push('🐰 Consider cruelty-free certification');
        }

        // Fair Trade Certified
        if (product.sustainability.fairTradeCertified) {
            score += 15;
            advantages.push('✅ Fair Trade certified');
        } else {
            suggestions.push('🤝 Look for Fair Trade certification');
        }

        // Renewable Energy Used
        if (product.sustainability.renewableEnergyUsed) {
            score += 10;
            advantages.push('✅ Produced using renewable energy');
        } else {
            suggestions.push('⚡ Consider switching to renewable energy');
        }

        // Energy Efficiency Rating (1-5, higher is better)
        if (product.sustainability.energyEfficiencyRating) {
            const efficiencyScore = product.sustainability.energyEfficiencyRating * 3;
            score += efficiencyScore;
            if (product.sustainability.energyEfficiencyRating >= 4) {
                advantages.push('✅ Excellent energy efficiency');
            } else if (product.sustainability.energyEfficiencyRating <= 2) {
                suggestions.push('💡 Improve energy efficiency rating');
            }
        }

        return { 
            score: Math.min(100, score), // Cap at 100
            advantages, 
            suggestions 
        };
    }

    /**
     * Get eco-friendly description for product comparison
     */
    getEcoDescription(product1, product2, score1, score2) {
        const winner = score1 > score2 ? product1 : product2;
        const loser = score1 > score2 ? product2 : product1;
        const scoreDiff = Math.abs(score1 - score2);

        let description = '';

        if (scoreDiff > 30) {
            description = `🌱 **${winner.name}** is significantly more eco-friendly than ${loser.name}. `;
            description += `This product excels in multiple sustainability categories.`;
        } else if (scoreDiff > 15) {
            description = `🌿 **${winner.name}** is moderately more sustainable than ${loser.name}. `;
            description += `It has clear advantages in key environmental areas.`;
        } else if (scoreDiff > 5) {
            description = `🍃 **${winner.name}** is slightly more eco-friendly than ${loser.name}. `;
            description += `Both have good sustainability practices, but the winner has a small edge.`;
        } else {
            description = `⚖️ **Both products have similar sustainability scores**. `;
            description += `Consider other factors like price, brand ethics, or specific certifications.`;
        }

        return description;
    }

    /**
     * Get external product data from Open Food Facts API
     */
    async getExternalProductData(product) {
        if (!product.name) return null;

        try {
            // Encode product name for URL
            const encodedName = encodeURIComponent(product.name);
            const response = await fetch(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodedName}&json=1`
            );
            
            if (!response.ok) return null;
            
            const data = await response.json();
            
            if (!data.products || data.products.length === 0) return null;

            // Get the first product from results
            const externalProduct = data.products[0];

            // Extract relevant sustainability data
            return {
                productName: externalProduct.product_name,
                ecoscore: externalProduct.ecoscore_score,
                ecoscoreGrade: externalProduct.ecoscore_grade,
                packaging: externalProduct.packaging,
                packagingRecycling: externalProduct.packaging_recycling,
                labels: externalProduct.labels_tags || [],
                ingredientsCount: externalProduct.ingredients?.length || 0,
                additives: externalProduct.additives_tags?.length || 0,
                origins: externalProduct.origins,
                manufacturingPlaces: externalProduct.manufacturing_places,
                environmentImpact: externalProduct.environment_impact_level,
                carbonFootprint: externalProduct.carbon_footprint,
                // Short description
                description: this.generateExternalDescription(externalProduct)
            };
        } catch (error) {
            console.error('Error fetching external data:', error);
            return null;
        }
    }

    /**
     * Generate description from external data
     */
    generateExternalDescription(externalData) {
        if (!externalData) return "No external sustainability data available.";

        let description = '';

        // Eco-score based description
        if (externalData.ecoscore_grade) {
            const gradeMap = {
                'a': '🌟 Excellent environmental rating',
                'b': '✅ Good environmental rating',
                'c': '⚡ Average environmental rating',
                'd': '⚠️ Below average environmental rating',
                'e': '❌ Poor environmental rating'
            };
            description += gradeMap[externalData.ecoscore_grade] || '';
        }

        // Additives info
        if (externalData.additives > 0) {
            description += ` Contains ${externalData.additives} additives. `;
            if (externalData.additives > 5) {
                description += 'High number of additives may impact eco-score. ';
            }
        }

        // Packaging info
        if (externalData.packaging) {
            description += ` Packaging: ${externalData.packaging}. `;
        }

        // Labels info
        if (externalData.labels && externalData.labels.length > 0) {
            description += ` Certified with: ${externalData.labels.slice(0, 3).join(', ')}. `;
        }

        return description || "Basic sustainability information available.";
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
        // Calculate scores
        const product1Result = this.calculateSustainabilityScore(product1);
        const product2Result = this.calculateSustainabilityScore(product2);

        const score1 = product1Result.score;
        const score2 = product2Result.score;

        // Determine winner
        let winner = null;
        if (score1 > score2) {
            winner = product1._id;
        } else if (score2 > score1) {
            winner = product2._id;
        }

        // Get eco-friendly description
        const ecoDescription = this.getEcoDescription(product1, product2, score1, score2);

        // Get external data
        const externalData1 = await this.getExternalProductData(product1);
        const externalData2 = await this.getExternalProductData(product2);

        // Generate graph data
        const comparisonGraph = this.generateComparisonGraphData(product1, product2, score1, score2);

        // Prepare recommendations
        const recommendations = {
            general: [
                ecoDescription,
                `📊 Sustainability score difference: ${Math.abs(score1 - score2)} points`
            ],
            product1Suggestions: product1Result.suggestions || [],
            product2Suggestions: product2Result.suggestions || []
        };

        // Add external data based suggestions
        if (externalData1?.additives > 5) {
            recommendations.product1Suggestions.push('High additive count - consider cleaner ingredients');
        }
        if (externalData2?.additives > 5) {
            recommendations.product2Suggestions.push('High additive count - consider cleaner ingredients');
        }

        return {
            products: [product1, product2],
            scores: {
                product1: score1,
                product2: score2,
                difference: Math.abs(score1 - score2)
            },
            winner,
            sustainabilityHighlights: {
                product1Advantages: product1Result.advantages,
                product2Advantages: product2Result.advantages
            },
            comparisonGraph,
            externalData: {
                product1: externalData1,
                product2: externalData2
            },
            recommendations,
            ecoDescription,
            summary: {
                bestFor: winner ? (winner === product1._id ? product1.name : product2.name) : 'Both products',
                keyDifference: this.getKeyDifference(product1, product2, product1Result, product2Result)
            }
        };
    }

    /**
     * Get key difference between products
     */
    getKeyDifference(product1, product2, result1, result2) {
        if (result1.advantages.length === 0 && result2.advantages.length === 0) {
            return "Both products need significant sustainability improvements";
        }

        if (result1.advantages.length > result2.advantages.length) {
            return `${product1.name} has more sustainability features (${result1.advantages.length} vs ${result2.advantages.length})`;
        } else if (result2.advantages.length > result1.advantages.length) {
            return `${product2.name} has more sustainability features (${result2.advantages.length} vs ${result1.advantages.length})`;
        } else {
            return "Both products have similar sustainability features";
        }
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
            externalData: comparisonData.externalData,
            recommendations: comparisonData.recommendations
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