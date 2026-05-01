export class CategoriesResponseDto {
  level: number;
  items: {
    id: string;
    code: string;
    name: string;
    level: number;
    father: {
      id: string;
      code: string;
      name: string;
      level: string;
      father: string;
      order: number;
      image: string;
    };
    order: number;
    image: string;
  }[];
}
