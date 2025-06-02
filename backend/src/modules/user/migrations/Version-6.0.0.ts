// Migration for profile statistics and views tracking
module.exports = async (client, schema) => {
  // Create profile_stats table
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."profile_stats" (
    "user_id" bigint PRIMARY KEY,
    "completion_percentage" integer DEFAULT 0,
    "profile_views" integer DEFAULT 0,
    "posts_count" integer DEFAULT 0,
    "followers_count" integer DEFAULT 0,
    "following_count" integer DEFAULT 0,
    "groups_count" integer DEFAULT 0,
    "trips_count" integer DEFAULT 0,
    "last_active" timestamp(6) without timezone,
    "created_at" timestamp(6) without timezone,
    "updated_at" timestamp(6) without timezone
  );`);

  // Create profile_views table for tracking who viewed whose profile
  await client.query(`CREATE TABLE IF NOT EXISTS ${schema}."profile_views" (
    "view_id" bigserial PRIMARY KEY,
    "viewer_id" bigint NOT NULL,
    "profile_owner_id" bigint NOT NULL,
    "viewed_at" timestamp(6) without timezone
  );`);

  // Create indexes for better performance
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_stats_user_id ON ${schema}."profile_stats"("user_id");
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_stats_completion ON ${schema}."profile_stats"("completion_percentage");
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_stats_last_active ON ${schema}."profile_stats"("last_active");
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON ${schema}."profile_views"("viewer_id");
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_views_owner ON ${schema}."profile_views"("profile_owner_id");
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON ${schema}."profile_views"("viewed_at");
  `);
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_profile_views_unique ON ${schema}."profile_views"("viewer_id", "profile_owner_id");
  `);
};
