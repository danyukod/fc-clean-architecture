import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import {InputCreateProductDto} from "./create.product.dto";

describe("Test create product use case", () => {

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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: InputCreateProductDto = {
            name: "Product A",
            price: 10,
        };

        const result = await usecase.execute(input);

        const resultFind = await productRepository.find(result.id);

        expect(resultFind.id).toEqual(result.id)
        expect(resultFind.name).toEqual(input.name);
        expect(resultFind.price).toEqual(input.price);
    });

    it("should not create a product with invalid price", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: InputCreateProductDto = {
            name: "Product A",
            price: -10,
        };

        await expect(usecase.execute(input)).rejects.toThrowError("Price must be greater than zero");
    });

    it("should not create a product with invalid name", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: InputCreateProductDto = {
            name: "",
            price: 10,
        }

        await expect(usecase.execute(input)).rejects.toThrowError("Name is required");

    });

});