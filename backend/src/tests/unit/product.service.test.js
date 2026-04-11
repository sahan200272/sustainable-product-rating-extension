import { jest } from "@jest/globals";

// Define mocks before importing the service
const mockProductModel = jest.fn().mockImplementation(() => ({
    save: jest.fn()
}));
mockProductModel.find = jest.fn();
mockProductModel.findById = jest.fn();
mockProductModel.findByIdAndDelete = jest.fn();

jest.unstable_mockModule("../../models/product.js", () => ({
    default: mockProductModel
}));

jest.unstable_mockModule("../../services/user.service.js", () => ({})); // If needed

jest.unstable_mockModule("../../services/ai.service.js", () => ({
    generateSustainability: jest.fn(),
    generateSustainabilityData: jest.fn()
}));

jest.unstable_mockModule("../../utils/cloudinaryUpload.js", () => ({
    default: jest.fn()
}));

jest.unstable_mockModule("../../utils/calculateSustainabilityScore.js", () => ({
    default: jest.fn()
}));

// Use dynamic imports for modules that depend on the mocks
const { default: Product } = await import("../../models/product.js");
const aiService = await import("../../services/ai.service.js");
const { default: cloudinaryUpload } = await import("../../utils/cloudinaryUpload.js");
const { default: calculateSustainabilityScore } = await import("../../utils/calculateSustainabilityScore.js");
const productService = await import("../../services/product.service.js");

describe("Product Service Unit Tests (ESM)", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createProduct", () => {
        test("should create and save a new product with AI data", async () => {
            const productData = {
                name: "Test Item",
                sustainability: { recyclableMaterial: true }
            };

            const mockSavedProduct = { ...productData, _id: "mockid123" };
            
            calculateSustainabilityScore.mockReturnValue(80);
            aiService.generateSustainabilityData.mockResolvedValue({
                score: 85,
                analysis: "Great eco product"
            });

            const mockSave = jest.fn().mockResolvedValue(mockSavedProduct);
            mockProductModel.mockImplementation(() => ({
                save: mockSave
            }));

            const result = await productService.createProduct(productData);

            expect(calculateSustainabilityScore).toHaveBeenCalledWith(productData.sustainability);
            expect(aiService.generateSustainabilityData).toHaveBeenCalledWith(productData);
            expect(mockSave).toHaveBeenCalled();
            expect(result.name).toBe("Test Item");
        });
    });

    describe("getAllProducts", () => {
        test("should return all products using find().lean()", async () => {
            const mockProducts = [{ name: "P1" }, { name: "P2" }];
            
            Product.find.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockProducts)
            });

            const result = await productService.getAllProducts();

            expect(Product.find).toHaveBeenCalled();
            expect(result).toHaveLength(2);
            expect(result).toEqual(mockProducts);
        });
    });

    describe("getSingleProduct", () => {
        test("should return a single product by ID", async () => {
            const mockProduct = { _id: "123", name: "P1" };
            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.getSingleProduct("123");

            expect(Product.findById).toHaveBeenCalledWith("123");
            expect(result).toEqual(mockProduct);
        });
    });

    describe("updateProduct", () => {
        test("should update product fields and handle new images", async () => {
            const existingProduct = {
                _id: "123",
                name: "Old Name",
                images: ["old.jpg"],
                save: jest.fn().mockImplementation(function() { return Promise.resolve(this); })
            };
            
            Product.findById.mockResolvedValue(existingProduct);
            cloudinaryUpload.mockResolvedValue(["new.jpg"]);

            const updateData = { name: "New Name" };
            const files = ["file1"];

            const result = await productService.updateProduct("123", updateData, files);

            expect(Product.findById).toHaveBeenCalledWith("123");
            expect(cloudinaryUpload).toHaveBeenCalledWith(files);
            expect(existingProduct.name).toBe("New Name");
            expect(existingProduct.images).toEqual(["old.jpg", "new.jpg"]);
            expect(existingProduct.save).toHaveBeenCalled();
        });

        test("should throw error if product not found", async () => {
            Product.findById.mockResolvedValue(null);
            await expect(productService.updateProduct("999", {}, [])).rejects.toThrow("Product not found");
        });
    });

    describe("deleteProduct", () => {
        test("should delete and return the deleted product", async () => {
            const mockDeletedProduct = { _id: "123", name: "Deleted Item" };
            Product.findByIdAndDelete.mockResolvedValue(mockDeletedProduct);

            const result = await productService.deleteProduct("123");

            expect(Product.findByIdAndDelete).toHaveBeenCalledWith("123");
            expect(result).toEqual(mockDeletedProduct);
        });

        test("should throw error if product to delete not found", async () => {
            Product.findByIdAndDelete.mockResolvedValue(null);
            await expect(productService.deleteProduct("999")).rejects.toThrow("Product not found");
        });
    });
});
