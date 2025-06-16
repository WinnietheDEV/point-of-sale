export interface IProduct {
  _id: string;
  name: string;
  stock: number;
  price: number;
  description?: string;
}

export interface IProductsLists {
  page: number;
  limit: number;
  data: IProduct[];
}
