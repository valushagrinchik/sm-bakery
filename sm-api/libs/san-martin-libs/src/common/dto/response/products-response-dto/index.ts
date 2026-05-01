export class ProductsResponseDto {
  products: {
    id: string;
    countryId: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    sku: string;
    dontShowInMenu: boolean;
    isActive: boolean;
    isAvailable: boolean;
    option: number;
    startTime: string | null;
    endTime: string | null;
  }[];
  category: {
    id: string;
    code: string;
    name: string;
    level: number;
    father: string;
    order: number;
    image: string;
  };
}
