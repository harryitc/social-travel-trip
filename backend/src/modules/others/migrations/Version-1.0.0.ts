// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."hashtags" (
    "tag_id" bigserial PRIMARY KEY,
    "name" varchar(255) UNIQUE NOT NULL,
    "slug" varchar(255) UNIQUE NOT NULL
  );`);
  await client.query(
    `INSERT INTO ${schema}."hashtags" ("name", "slug") VALUES ('Du lịch Việt Nam', 'du lich viet nam'), ('Phú Quốc', 'phu quoc'), ('Đà Nẵng', 'da nang'), ('Sapa', 'sapa'), ('Hạ Long', 'ha long'), ('Đà Lạt', 'da lat'), ('Hội An', 'hoi an'), ('Nha Trang', 'nha trang'), ('Hà Nội', 'ha noi'), ('TP. Hồ Chí Minh', 'tp ho chi minh'), ('Huế', 'hue'), ('Mũi Né', 'mui ne'), ('Quy Nhơn', 'quy nhon'), ('Vũng Tàu', 'vung tau'), ('Cần Thơ', 'can tho'), ('Đồng Xoài', 'dong xoai'), ('Bắc Kạn', 'bac kan'), ('Bắc Giang', 'bac giang'), ('Bạc Liêu', 'bac lieu'), ('Bắc Ninh', 'bac ninh'), ('Bến Tre', 'ben tre'), ('Bình Định', 'binh dinh'), ('Bình Dương', 'binh duong'), ('Bình Phước', 'binh phuoc'), ('Bình Thuận', 'binh thuan'), ('Cà Mau', 'ca mau'), ('Cao Bằng', 'cao bang'), ('Đắk Lắk', 'dak lak'), ('Đắk Nông', 'dak nong'), ('Điện Biên', 'dien bien'), ('Đồng Tháp', 'dong thap'), ('Gia Lai', 'gia lai'), ('Hà Giang', 'ha giang'), ('Hà Nam', 'ha nam'), ('Hà Tĩnh', 'ha tinh'), ('Hải Dương', 'hai duong'), ('Hậu Giang', 'hau giang'), ('Hòa Bình', 'hoa binh'), ('Hưng Yên', 'hung yen'), ('Khánh Hòa', 'khanh hoa'), ('Kiên Giang', 'kien giang'), ('Kon Tum', 'kon tum'), ('Lai Châu', 'lai chau'), ('Lâm Đồng', 'lam dong'), ('Lạng Sơn', 'lang son'), ('Lào Cai', 'lao cai'), ('Long An', 'long an'), ('Nam Định', 'nam dinh'), ('Nghệ An', 'nghhe an'), ('Ninh Bình', 'ninh binh'), ('Ninh Thuận', 'ninh thuan'), ('Phú Thọ', 'phu tho'), ('Phú Yên', 'phu yen'), ('Quảng Bình', 'quang binh'), ('Quảng Nam', 'quang nam'), ('Quảng Ngãi', 'quang ngai'), ('Quảng Ninh', 'quang ninh'), ('Quảng Trị', 'quang tri'), ('Sóc Trăng', 'soc trang'), ('Sơn La', 'son la'), ('Tây Ninh', 'tay ninh'), ('Thái Bình', 'thai binh'), ('Thái Nguyên', 'thai nguyen'), ('Thanh Hóa', 'thanh hoa'), ('Thừa Thiên Huế', 'thua thien hue'), ('Tiền Giang', 'tien giang'), ('Trà Vinh', 'tra vinh'), ('Tuyên Quang', 'tuyen quang'), ('Vĩnh Long', 'vinh long'), ('Vĩnh Phúc', 'vinh phuc'), ('Yên Bái', 'yen bai');`,
  );

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."activities" (
    "activity_id" bigserial PRIMARY KEY,
    "name" varchar(255) UNIQUE NOT NULL,
    "slug" varchar(255) UNIQUE NOT NULL,
    "description" varchar(255),
    "json_data" jsonb
  );`);
  await client.query(
    `INSERT INTO ${schema}."activities" ("name", "slug") VALUES ('Ăn sáng', 'an sang'), ('Ăn trưa', 'an trua'), ('Ăn tối', 'an toi'), ('Cà phê', 'ca phe'), ('Tham quan', 'tham quan'), ('Mua sắm', 'mua sam'), ('Nghỉ ngơi', 'nghi ngoi'), ('Di chuyển', 'di chuyen'), ('Khác', 'khac');`,
  );

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."categories" (
    "category_id" bigserial PRIMARY KEY,
    "name" varchar(255) UNIQUE NOT NULL,
    "slug" varchar(255) UNIQUE NOT NULL
  );`);
  await client.query(
    `INSERT INTO ${schema}."categories" ("name", "slug") VALUES ('Du lịch', 'du lich'), ('Ẩm thực', 'am thuc'), ('Khách sạn', 'khach san'), ('Cafe', 'cafe'), ('Shopping', 'shopping'), ('Khác', 'khac');`,
  );

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."provinces" (
    "province_id" bigserial PRIMARY KEY,
    "name" varchar(100)
  );`);
  await client.query(
    `INSERT INTO ${schema}."provinces" ("name") VALUES ('Hà Nội'), ('Hồ Chí Minh'), ('Đà Nẵng'), ('Cần Thơ'), ('Bình Dương'), ('Đồng Nai'), ('Hải Phòng'), ('Bà Rịa - Vũng Tàu'), ('An Giang'), ('Bắc Giang'), ('Bắc Kạn'), ('Bạc Liêu'), ('Bắc Ninh'), ('Bến Tre'), ('Bình Định'), ('Bình Phước'), ('Bình Thuận'), ('Cà Mau'), ('Cao Bằng'), ('Đắk Lắk'), ('Đắk Nông'), ('Điện Biên'), ('Đồng Tháp'), ('Gia Lai'), ('Hà Giang'), ('Hà Nam'), ('Hà Tĩnh'), ('Hải Dương'), ('Hậu Giang'), ('Hòa Bình'), ('Hưng Yên'), ('Khánh Hòa'), ('Kiên Giang'), ('Kon Tum'), ('Lai Châu'), ('Lâm Đồng'), ('Lạng Sơn'), ('Lào Cai'), ('Long An'), ('Nam Định'), ('Nghệ An'), ('Ninh Bình'), ('Ninh Thuận'), ('Phú Thọ'), ('Phú Yên'), ('Quảng Bình'), ('Quảng Nam'), ('Quảng Ngãi'), ('Quảng Ninh'), ('Quảng Trị'), ('Sóc Trăng'), ('Sơn La'), ('Tây Ninh'), ('Thái Bình'), ('Thái Nguyên'), ('Thanh Hóa'), ('Thừa Thiên Huế'), ('Tiền Giang'), ('Trà Vinh'), ('Tuyên Quang'), ('Vĩnh Long'), ('Vĩnh Phúc'), ('Yên Bái');`,
  );

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."cities" (
    "city_id" bigserial PRIMARY KEY,
    "name" varchar(100),
    "province_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."place_reviews" (
    "place_review_id" bigserial PRIMARY KEY,
    "content" varchar(255),
    "json_data" jsonb,
    "created_at" timestamp(6) without timezone,
    "updated_at" timestamp(6) without timezone,
    "user_id" int8,
    "place_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."place_saved" (
    "place_saved_id" bigserial PRIMARY KEY,
    "user_id" int8,
    "place_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."places" (
    "place_id" bigserial PRIMARY KEY,
    "name" varchar(100),
    "thumbnail_url" text,
    "json_data" jsonb,
    "region" varchar(100),
    "location" jsonb,
    "city_id" int8
  );`);

  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."reactions" (
    "reaction_id" bigserial PRIMARY KEY,
    "name" varchar(50)
  );`);
  await client.query(
    `INSERT INTO ${schema}."reactions" ("name") VALUES ('default'), ('like'), ('love'), ('haha'), ('wow'), ('sad');`,
  );
};
