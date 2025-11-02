import { PRODUCTS } from "@/constants/products";

export const useStore = () => {
  return {
    products: PRODUCTS,
  };
};