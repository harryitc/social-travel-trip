// Migration for creating group_invitations table to handle group invitation system
module.exports = async (client, schema) => {
  // Create group_invitations table
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${schema}."group_invitations" (
      "invitation_id" SERIAL PRIMARY KEY,
      "group_id" INTEGER NOT NULL,
      "inviter_id" INTEGER NOT NULL,
      "invited_user_id" INTEGER NOT NULL,
      "status" VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
      "invited_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "responded_at" TIMESTAMP NULL,
      "expires_at" TIMESTAMP NOT NULL
    );
  `);

  // Add foreign key constraints with CASCADE delete for automatic cleanup
  await client.query(`
    ALTER TABLE ${schema}."group_invitations"
    ADD CONSTRAINT fk_group_invitations_group_id
    FOREIGN KEY (group_id) REFERENCES ${schema}."groups"(group_id) ON DELETE CASCADE;
  `);

  await client.query(`
    ALTER TABLE ${schema}."group_invitations"
    ADD CONSTRAINT fk_group_invitations_inviter_id
    FOREIGN KEY (inviter_id) REFERENCES ${schema}."users"(user_id) ON DELETE CASCADE;
  `);

  await client.query(`
    ALTER TABLE ${schema}."group_invitations"
    ADD CONSTRAINT fk_group_invitations_invited_user_id
    FOREIGN KEY (invited_user_id) REFERENCES ${schema}."users"(user_id) ON DELETE CASCADE;
  `);

  // Create indexes for better performance
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_group_invitations_group_id 
    ON ${schema}."group_invitations"(group_id);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_group_invitations_invited_user_id 
    ON ${schema}."group_invitations"(invited_user_id);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_group_invitations_status 
    ON ${schema}."group_invitations"(status);
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_group_invitations_expires_at 
    ON ${schema}."group_invitations"(expires_at);
  `);

  // Create partial index for pending invitations only (for better performance on active invitations)
  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_group_invitations_pending
    ON ${schema}."group_invitations"(group_id, invited_user_id)
    WHERE status = 'pending';
  `);

  // Create unique constraint to prevent duplicate pending invitations
  // Note: We use a partial unique index instead of a table constraint to allow multiple non-pending invitations
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_group_invitations_unique_pending 
    ON ${schema}."group_invitations"(group_id, invited_user_id) 
    WHERE status = 'pending';
  `);
};
