export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

export interface UserProduct {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  _creationTime: number;
}

export interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  quantity?: number;
}