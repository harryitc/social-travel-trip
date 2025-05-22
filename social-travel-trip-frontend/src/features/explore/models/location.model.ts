/**
 * Province model
 */
export class Province {
  province_id: string;
  name: string;

  constructor(data: any) {
    this.province_id = data.province_id;
    this.name = data.name;
  }

  /**
   * Create a Province instance from API response
   * @param data API response data
   * @returns Province instance
   */
  static fromResponse(data: any): Province {
    return new Province(data);
  }

  /**
   * Create an array of Province instances from API response
   * @param data API response data
   * @returns Array of Province instances
   */
  static fromResponseArray(data: any[]): Province[] {
    return data.map(item => Province.fromResponse(item));
  }
}

/**
 * City model
 */
export class City {
  city_id: string;
  name: string;
  province_id: string;
  image?: string;
  posts_count?: number;

  constructor(data: any) {
    this.city_id = data.city_id;
    this.name = data.name;
    this.province_id = data.province_id;
    this.image = data.image;
    this.posts_count = data.posts_count || 0;
  }

  /**
   * Create a City instance from API response
   * @param data API response data
   * @returns City instance
   */
  static fromResponse(data: any): City {
    return new City(data);
  }

  /**
   * Create an array of City instances from API response
   * @param data API response data
   * @returns Array of City instances
   */
  static fromResponseArray(data: any[]): City[] {
    return data.map(item => City.fromResponse(item));
  }
}

/**
 * Location model
 */
export class Location {
  location_id?: string;
  city_id?: string;
  name: string;
  description?: string;
  lat?: number;
  lng?: number;
  image?: string;
  posts_count?: number;

  constructor(data: any) {
    this.location_id = data.location_id;
    this.city_id = data.city_id;
    this.name = data.name;
    this.description = data.description;
    this.lat = data.lat;
    this.lng = data.lng;
    this.image = data.image;
    this.posts_count = data.posts_count || 0;
  }

  /**
   * Create a Location instance from API response
   * @param data API response data
   * @returns Location instance
   */
  static fromResponse(data: any): Location {
    return new Location(data);
  }

  /**
   * Create an array of Location instances from API response
   * @param data API response data
   * @returns Array of Location instances
   */
  static fromResponseArray(data: any[]): Location[] {
    return data.map(item => Location.fromResponse(item));
  }
}

/**
 * Hashtag model
 */
export class Hashtag {
  tag_id: string;
  name: string;
  slug: string;
  posts?: number;

  constructor(data: any) {
    this.tag_id = data.tag_id;
    this.name = data.name;
    this.slug = data.slug;
    this.posts = data.posts || 0;
  }

  /**
   * Create a Hashtag instance from API response
   * @param data API response data
   * @returns Hashtag instance
   */
  static fromResponse(data: any): Hashtag {
    return new Hashtag(data);
  }

  /**
   * Create an array of Hashtag instances from API response
   * @param data API response data
   * @returns Array of Hashtag instances
   */
  static fromResponseArray(data: any[]): Hashtag[] {
    return data.map(item => Hashtag.fromResponse(item));
  }
}

/**
 * Location query parameters model
 */
export class LocationQueryParams {
  page?: number;
  limit?: number;
  province_id?: string;
  search?: string;

  constructor(data: any = {}) {
    this.page = data.page;
    this.limit = data.limit;
    this.province_id = data.province_id;
    this.search = data.search;
  }
}
