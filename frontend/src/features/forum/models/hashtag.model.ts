import { get } from "lodash";

export class HashtagModel {
  tag_id: number;
  name: string;
  slug: string;

  constructor(data: any) {
    this.tag_id = get(data, 'tag_id', -1);
    this.name = get(data, 'name', '');
    this.slug = get(data, 'slug', '');
  }
}
