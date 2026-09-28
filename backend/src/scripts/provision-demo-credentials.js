require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function main() {
  const email = String(process.env.DEMO_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.DEMO_PASSWORD || '');
  if (!email || !email.includes('@') || password.length < 12 || password.length > 72) {
    throw new Error('Complete local demo credentials are required');
  }
  await sequelize.authenticate();
  const passwordHash = await bcrypt.hash(password, 12);
  await User.upsert({ email, password: passwordHash, name: 'Runtime Administrator', role: 'admin' });
  console.log('Local demo identity is ready.');
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
