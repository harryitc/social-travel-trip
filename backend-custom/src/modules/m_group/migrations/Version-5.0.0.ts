// Migration for adding reply functionality to group messages
module.exports = async (client, schema) => {
  // Add reply_to_message_id column to group_messages table
  await client.query(`ALTER TABLE ${schema}."group_messages" 
    ADD COLUMN IF NOT EXISTS "reply_to_message_id" int8
    ;`);

  // Add foreign key constraint for reply_to_message_id
  await client.query(`ALTER TABLE ${schema}."group_messages" 
    ADD CONSTRAINT fk_group_messages_reply_to_message_id 
    FOREIGN KEY (reply_to_message_id) 
    REFERENCES ${schema}."group_messages" (group_message_id) 
    ON DELETE SET NULL
    ;`);

  // Add index for faster lookups on reply_to_message_id
  await client.query(
    `CREATE INDEX IF NOT EXISTS idx_group_messages_reply_to_message_id 
     ON ${schema}."group_messages" (reply_to_message_id);`,
  );
};
