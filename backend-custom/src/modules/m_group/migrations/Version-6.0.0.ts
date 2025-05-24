// Migration for removing foreign key constraint from group_messages (Version 6.0.0)
module.exports = async (client, schema) => {
  // Remove foreign key constraint if it exists from Version 5.0.0
  try {
    await client.query(`ALTER TABLE ${schema}."group_messages"
      DROP CONSTRAINT IF EXISTS fk_group_messages_reply_to_message_id
      ;`);
  } catch (error) {
    // Ignore error if constraint doesn't exist
    console.log('Foreign key constraint not found or already removed');
  }

  // Ensure reply_to_message_id column exists (in case Version 5 failed)
  await client.query(`ALTER TABLE ${schema}."group_messages"
    ADD COLUMN IF NOT EXISTS "reply_to_message_id" int8
    ;`);

  // Ensure index exists for faster lookups (without foreign key constraint)
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_group_messages_reply_to_message_id
     ON ${schema}."group_messages" (reply_to_message_id);`,
  );
};
