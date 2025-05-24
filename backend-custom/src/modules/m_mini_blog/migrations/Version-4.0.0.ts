module.exports = async (client, schema) => {
  // Update timestamp columns to timestamp without time zone with default in mini_blog_comments table
  await client.query(`ALTER TABLE ${schema}."mini_blog_comments"
    ALTER COLUMN "created_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp without time zone with default in mini_blog_comment_likes table
  await client.query(`ALTER TABLE ${schema}."mini_blog_comment_likes"
    ALTER COLUMN "created_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp without time zone with default in mini_blog_shareable table
  await client.query(`ALTER TABLE ${schema}."mini_blog_shareable"
    ALTER COLUMN "created_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp without time zone with default in mini_blogs table
  await client.query(`ALTER TABLE ${schema}."mini_blogs"
    ALTER COLUMN "created_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp without time zone with default in mini_blog_likes table
  await client.query(`ALTER TABLE ${schema}."mini_blog_likes"
    ALTER COLUMN "created_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp;`);
};
