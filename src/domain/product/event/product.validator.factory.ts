import ProductYupValidator from "../validator/product.yup.validator";

export default class ProductValidatorFactory {
    static create() {
        return new ProductYupValidator();
    }
}