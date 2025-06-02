module.exports = async (client, schema) => {
  // Update timestamp columns to timestamp with default in group_messages table
  await client.query(`ALTER TABLE ${schema}."group_messages"
    ALTER COLUMN "created_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp with default in groups table
  await client.query(`ALTER TABLE ${schema}."groups"
    ALTER COLUMN "created_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp with default in message_likes table
  await client.query(`ALTER TABLE ${schema}."message_likes"
    ALTER COLUMN "created_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp;`);

  // Update timestamp columns to timestamp with default in message_pins table
  await client.query(`ALTER TABLE ${schema}."message_pins"
    ALTER COLUMN "created_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp;`);

  // Update join_at column to timestamp with default in group_members table
  await client.query(`ALTER TABLE ${schema}."group_members"
    ALTER COLUMN "join_at" TYPE timestamp(6) without timezone,
    ALTER COLUMN "join_at" SET DEFAULT current_timestamp;`);

  // Update join_code_expires_at column to timestamp in groups table (no default for expiration)
  await client.query(`ALTER TABLE ${schema}."groups"
    ALTER COLUMN "join_code_expires_at" TYPE timestamp(6) without timezone;`);
};
