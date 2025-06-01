// Migration for adding join_code to groups table
module.exports = async (client, schema) => {
  // Add join_code column to groups table
  await client.query(`ALTER TABLE ${schema}."groups" 
    ADD COLUMN IF NOT EXISTS "join_code" varchar(50),
    ADD COLUMN IF NOT EXISTS "join_code_expires_at" timestamp(6)
    ;`);

  // Add index for faster lookups
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_groups_join_code ON ${schema}."groups" (join_code);`,
  );
};
