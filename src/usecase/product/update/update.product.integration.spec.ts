import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import {Sequelize} from "sequelize-typescript";
import UpdateProductUseCase from "./update.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import {InputUpdateProductDto} from "./update.product.dto";

describe("Test update product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = ProductFactory.createWithId("Product A", 10);

        await productRepository.create(product);

        const input = {
            id: product.id,
            name: "Product B",
            price: 20,
        }

        const output = {
            id: product.id,
            name: "Product B",
            price: 20,
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });

    it("should throw error when product not found", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const input: InputUpdateProductDto = {
            id: "123",
            name: "Product B",
            price: 20,
        }

        await expect(usecase.execute(input)).rejects.toThrowError("Product not found");
    });
});