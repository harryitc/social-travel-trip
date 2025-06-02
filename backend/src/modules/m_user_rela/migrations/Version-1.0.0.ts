module.exports = async (client, schema) => {
  /**
   * Bảng user_rela: mối quan hệ giữa người dùng
   * user_id: người dùng
   * following: người đang follow
   */
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."user_rela" (
    "user_rela_id" bigserial PRIMARY KEY,
    "user_id" int8 NOT NULL,
    "following" int8 NOT NULL,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("user_id", "following")
  );`);
};
