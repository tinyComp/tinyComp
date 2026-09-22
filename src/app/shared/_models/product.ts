import { Page } from "./page";
import { ProductType } from "./product-type.enum";

export class Product {
    type: ProductType;
    pages: Page[];
}
