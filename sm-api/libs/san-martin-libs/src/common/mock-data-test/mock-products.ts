import { EntityStatus } from '../';

export const mockProducts = [
  {
    name: 'Manías de Chiquimula',
    sku: '32565',
    slug: 'manas-de-chiquimula',
    description: '',
    image: 'http://ds1e83w8pn0gs.cloudfront.net/fotosmultisite/32565-1.jpg',
    price: 32.0,
    isVisibility: true,
    status: EntityStatus.ACTIVE,
    isAvailable: true,
  },
  {
    name: 'Poporopos Sabor Cheddar',
    sku: '31425',
    slug: 'poporopos-sabor-cheddar',
    description: '¡El snack perfecto! Deliciosos poporopos sabor cheddar. Bolsa de 30 gramos.',
    image: 'https://ds1e83w8pn0gs.cloudfront.net/fotosmultisite/31425-1.jpg',
    price: 19.0,
    isVisibility: true,
    status: EntityStatus.ACTIVE,
    isAvailable: true,
  },
  {
    name: 'Miel de Abeja',
    sku: '31426',
    slug: 'miel-de-abeja',
    description: '100% miel de abeja pura. Frasco de 710 gramos.',
    image: 'https://ds1e83w8pn0gs.cloudfront.net/fotosmultisite/31426-1.jpg',
    price: 59.0,
    isVisibility: true,
    status: EntityStatus.ACTIVE,
    isAvailable: true,
  },
];
