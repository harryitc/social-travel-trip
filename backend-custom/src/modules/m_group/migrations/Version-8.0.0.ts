// Migration for adding json_data column to group_messages table for storing attachments and images
module.exports = async (client, schema) => {
  // Add json_data column to group_messages table for storing attachments, images, and other metadata
  await client.query(`ALTER TABLE ${schema}."group_messages" 
    ADD COLUMN IF NOT EXISTS "json_data" jsonb
    ;`);

  // Add index for faster lookups on json_data
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_group_messages_json_data 
     ON ${schema}."group_messages" USING GIN (json_data);`,
  );

  // Add index for faster lookups on json_data images field specifically
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_group_messages_images 
     ON ${schema}."group_messages" USING GIN ((json_data->'images'));`,
  );
};
