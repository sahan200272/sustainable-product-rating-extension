import { jest } from "@jest/globals";
import calculateSustainabilityScore from "../../utils/calculateSustainabilityScore.js";

describe("calculateSustainabilityScore Utility", () => {
    
    // Test Case: Perfect Product Score
    // Ensures that an item with all positive sustainability traits and optimal metrics
    // achieves the maximum possible score of 100.
    test("should calculate maximum score of 100 for a perfect product", () => {
        const sustainability = {
            recyclableMaterial: true,
            biodegradable: true,
            plasticFree: true,
            crueltyFree: true,
            fairTradeCertified: true,
            renewableEnergyUsed: true,
            carbonFootprint: 0,
            energyEfficiencyRating: 5
        };

        const score = calculateSustainabilityScore(sustainability);
        expect(score).toBe(100);
    });

    // Test Case: Minimal Product Score
    // Verifies that a product with no positive traits and worst metrics 
    // scores a 0 (the absolute baseline).
    test("should calculate minimum score for a poor product", () => {
        const sustainability = {
            recyclableMaterial: false,
            biodegradable: false,
            plasticFree: false,
            crueltyFree: false,
            fairTradeCertified: false,
            renewableEnergyUsed: false,
            carbonFootprint: 20,
            energyEfficiencyRating: 0
        };

        const score = calculateSustainabilityScore(sustainability);
        expect(score).toBe(0);
    });

    // Test Case: Partial Score Calculation
    // Evaluates whether the utility correctly accumulates points for a mix
    // of positive and negative/neutral traits based on formulas.
    test("should calculate partial score correctly", () => {
        const sustainability = {
            recyclableMaterial: true,    // +10
            biodegradable: false,
            plasticFree: true,           // +10
            crueltyFree: false,
            fairTradeCertified: true,    // +10
            renewableEnergyUsed: false,
            carbonFootprint: 10,         // (1 - (10/20))*20 = 10
            energyEfficiencyRating: 2.5  // (2.5/5)*20 = 10
        };

        const score = calculateSustainabilityScore(sustainability);
        expect(score).toBe(50);
    });

    // Test Case: Negative Value Handling
    // Tests the system's ability to penalize products when specific negative
    // metrics (like extremely high carbon footprint) exceed regular constraints.
    test("should handle carbon footprint > 20 as negative impact", () => {
        const sustainability = {
            recyclableMaterial: false,
            biodegradable: false,
            plasticFree: false,
            crueltyFree: false,
            fairTradeCertified: false,
            renewableEnergyUsed: false,
            carbonFootprint: 30,         // (1 - (30/20))*20 = -10
            energyEfficiencyRating: 0
        };

        const score = calculateSustainabilityScore(sustainability);
        expect(score).toBe(-10);
    });
});
