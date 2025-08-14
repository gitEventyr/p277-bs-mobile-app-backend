const { Client } = require('pg');

const client = new Client({
  host: '172.21.0.2',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'casino_dev',
  ssl: false,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    const result = await client.query('SELECT COUNT(*) FROM players');
    console.log('✅ Query successful:', result.rows[0]);
    
    await client.end();
    console.log('✅ Connection closed successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();