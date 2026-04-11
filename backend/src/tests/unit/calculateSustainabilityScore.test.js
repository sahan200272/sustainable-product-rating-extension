import { jest } from "@jest/globals";
import calculateSustainabilityScore from "../../utils/calculateSustainabilityScore.js";

describe("calculateSustainabilityScore Utility", () => {
    
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
