import {Sequelize} from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Test list product use case", () => {
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

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const productA = ProductFactory.createWithId("Product A", 10);
        const productB = ProductFactory.createWithId("Product B", 20);

        await productRepository.create(productA);
        await productRepository.create(productB);

        const result = await usecase.execute({});
        expect(result.products.length).toEqual(2);
        expect(result.products[0].id).toEqual(productA.id);
        expect(result.products[0].name).toEqual(productA.name);
        expect(result.products[0].price).toEqual(productA.price);
        expect(result.products[1].id).toEqual(productB.id);
        expect(result.products[1].name).toEqual(productB.name);
        expect(result.products[1].price).toEqual(productB.price);
    });
});