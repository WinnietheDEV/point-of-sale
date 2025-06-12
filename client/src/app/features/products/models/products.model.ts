export interface IProduct {
  _id?: string;
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

interface IGetProductsParams {
  page: number;
  limit: number;
  sort: string;
  order: 'desc' | 'asc';
  search: string;
}
