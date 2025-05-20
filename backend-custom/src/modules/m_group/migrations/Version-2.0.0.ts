// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`ALTER TABLE ${schema}."group_members" 
    ADD CONSTRAINT unique_group_user_pair UNIQUE (group_id, user_id)
    ;`);
};
