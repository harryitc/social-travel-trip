export class CreatePostDTO {
  content: string;
  title?: string;
  media_urls?: string[];
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  hashtags?: string[];
  mentions?: {
    id: string;
    name: string;
  }[];
}
