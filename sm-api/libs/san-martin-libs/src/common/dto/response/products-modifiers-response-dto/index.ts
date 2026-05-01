export class ProductModifier {
  modifierId: string;
  productId: string;
  typeChange: string;
  isDefault: boolean;
  price: number;
  product: {
    id: string;
    name: string;
    sku: number;
    modifiers: [
      {
        id: string;
        name: string;
        sku: number;
        typeModifier: number;
        order: number;
      },
    ];
  };
}

export class ProductsModifiersResponseDto {
  modifiers: [
    {
      id: string;
      name: string;
      sku: number;
      typeModifier: number;
      order: number;
      productModifier: ProductModifier[];
    },
  ];
}
