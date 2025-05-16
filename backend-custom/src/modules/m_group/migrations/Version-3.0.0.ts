// Migration for table: activities
module.exports = async (client, schema) => {
  await client.query(`ALTER TABLE ${schema}."message_pins" 
    ADD CONSTRAINT unique_group_message_pins_pair UNIQUE (group_id, group_message_id)
    ;`);
};
