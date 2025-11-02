export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "batman_badge",
    title: "Batman Badge",
    image: "https://storage.worldfriends.app/batman-badge",
    price: 0.99,
    description: "Iconic Batman badge for superhero fans and collectors alike.",
  }
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((product) => product.id === id);
};