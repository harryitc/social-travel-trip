module.exports = async (client, schema) => {
  // Update created_at and updated_at columns to timestamp with default
  await client.query(`ALTER TABLE ${schema}."plans"
    ALTER COLUMN "created_at" TYPE timestamp(6) WITHOUT TIME ZONE,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(6) WITHOUT TIME ZONE,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);
};
