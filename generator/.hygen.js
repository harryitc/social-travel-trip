module.exports = {
    helpers: {
        // Convert PostgreSQL data type text to TypeScript data type text
        toTSDatatype: pgType => {
            switch (pgType.toLowerCase()) {
                case 'varchar':
                case 'char':
                case 'text':
                case 'citext':
                case 'character varying':
                    return 'string';
                case 'int':
                case 'integer':
                case 'smallint':
                case 'bigint':
                case 'serial':
                case 'smallserial':
                case 'bigserial':
                    return 'number';
                case 'real':
                case 'double precision':
                    return 'number';
                case 'numeric':
                case 'decimal':
                    return 'number';
                case 'boolean':
                    return 'boolean';
                case 'date':
                    return 'Date';
                case 'time':
                case 'timetz':
                    return 'string'
                case 'timestamp':
                case 'timestamptz':
                case 'timestamp(0) without time zone':
                    return 'Date';
                case 'interval':
                    return 'string';
                case 'json':
                case 'jsonb':
                    return 'any';
                default:
                    return 'any';
            }
        },
    }
}
