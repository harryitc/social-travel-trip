module.exports = async (client, schema) => {
  // Update created_at and updated_at columns to timestamp without time zone with default in place_reviews table
  await client.query(`ALTER TABLE ${schema}."place_reviews"
    ALTER COLUMN "created_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "created_at" SET DEFAULT current_timestamp,
    ALTER COLUMN "updated_at" TYPE timestamp(0) without time zone,
    ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;`);
};
