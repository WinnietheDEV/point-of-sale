import { ICartItem } from '../../cart/model/cart.model';

export interface ITransaction {
  _id?: string;
  products: ICartItem[];
  grandTotal: number;
  pay: number;
  change: number;
  paymentMethod: string;
}
