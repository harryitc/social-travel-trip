export class Province {
  province_id: number;
  name: string;

  constructor(args?: any) {
    if (args) {
      this.province_id = args.province_id;
      this.name = args.name;
    }
  }
}

export class City {
  city_id: number;
  name: string;
  province_id: number;

  constructor(args?: any) {
    if (args) {
      this.city_id = args.city_id;
      this.name = args.name;
      this.province_id = args.province_id;
    }
  }
}

export class Hashtag {
  tag_id: number;
  name: string;
  slug: string;

  constructor(args?: any) {
    if (args) {
      this.tag_id = args.tag_id;
      this.name = args.name;
      this.slug = args.slug;
    }
  }
}

export class Activity {
  activity_id: number;
  name: string;
  slug: string;

  constructor(args?: any) {
    if (args) {
      this.activity_id = args.activity_id;
      this.name = args.name;
      this.slug = args.slug;
    }
  }
}

export class Category {
  category_id: number;
  name: string;
  slug: string;

  constructor(args?: any) {
    if (args) {
      this.category_id = args.category_id;
      this.name = args.name;
      this.slug = args.slug;
    }
  }
}

export class Reaction {
  reaction_id: number;
  name: string;

  constructor(args?: any) {
    if (args) {
      this.reaction_id = args.reaction_id;
      this.name = args.name;
    }
  }
}
