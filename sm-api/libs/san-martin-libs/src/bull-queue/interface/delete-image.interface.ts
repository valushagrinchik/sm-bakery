import { Job } from 'bull';

interface deleteImage {
  key: string;
}

export interface iDeleteImage extends Job {
  data: deleteImage;
}
