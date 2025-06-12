import { IProduct } from '../../products/models/products.model';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}
