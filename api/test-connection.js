/**
 * Try connecting via pg with the connection string directly (URL format)
 * This sometimes handles IPv6 brackets differently
 */
const { Client } = require('pg');

async function test() {
  // Try with URL format - pg handles IPv6 in brackets
  const connectionStrings = [
    `postgresql://postgres:nigar2233451@[2406:da12:5ca:b701:39b0:9740:a1a3:3b90]:5432/postgres?sslmode=require`,
  ];

  for (const cs of connectionStrings) {
    const client = new Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
    const label = cs.substring(0, 60) + '...';
    process.stdout.write(`Testing [${label}] ... `);
    try {
      await client.connect();
      const res = await client.query('SELECT current_database(), current_user');
      console.log('SUCCESS ✅  db:', res.rows[0].current_database, '| user:', res.rows[0].current_user);
      await client.end();
    } catch (e) {
      console.log(`FAILED ❌  ${e.message}`);
    }
  }

  // Check if IPv6 is available at all
  const net = require('net');
  const s = net.createConnection({ host: '2406:da12:5ca:b701:39b0:9740:a1a3:3b90', port: 5432, family: 6 });
  s.setTimeout(5000);
  s.on('connect', () => { console.log('Raw IPv6 TCP: CONNECTED ✅'); s.destroy(); });
  s.on('timeout', () => { console.log('Raw IPv6 TCP: TIMEOUT ❌ — no IPv6 routing'); s.destroy(); });
  s.on('error', (e) => { console.log('Raw IPv6 TCP: ERROR ❌ —', e.message); });
}
test();
