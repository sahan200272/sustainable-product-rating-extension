import { jest } from "@jest/globals";

jest.resetModules();

jest.unstable_mockModule("../../utils/geminiClient.js", () => ({
  geminiModel: {
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => "AI verdict" }
    })
  }
}));

const comparisonService = (await import("../../services/comparison.service.js")).default;

describe("Comparison Service", () => {

  test("calculateSustainabilityInsights should return values", () => {
    const product = {
      sustainability: {
        recyclableMaterial: true,
        biodegradable: true,
        plasticFree: false,
        carbonFootprint: 1,
        crueltyFree: true,
        fairTradeCertified: true,
        renewableEnergyUsed: true,
        energyEfficiencyRating: 5
      }
    };

    const result = comparisonService.calculateSustainabilityInsights(product);

    expect(result.advantages.length).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test("compareProducts should determine winner correctly", async () => {
    const p1 = {
      _id: "1",
      name: "A",
      sustainabilityScore: 90,
      sustainability: {}
    };

    const p2 = {
      _id: "2",
      name: "B",
      sustainabilityScore: 50,
      sustainability: {}
    };

    const result = await comparisonService.compareProducts(p1, p2);

    expect(result.winner.toString()).toBe("1");
    expect(result.scores.product1).toBe(90);
    expect(result.scores.product2).toBe(50);
  });

  test("should handle tie", async () => {
    const p1 = { _id: "1", name: "A", sustainabilityScore: 50, sustainability: {} };
    const p2 = { _id: "2", name: "B", sustainabilityScore: 50, sustainability: {} };

    const result = await comparisonService.compareProducts(p1, p2);

    expect(result.winner).toBe(null);
  });

  test("graph generation works", () => {
    const graph = comparisonService.generateComparisonGraphData(
      { name: "A", sustainability: {} },
      { name: "B", sustainability: {} },
      10,
      20
    );

    expect(graph.datasets.length).toBe(2);
    expect(graph.labels.length).toBeGreaterThan(0);
  });

});