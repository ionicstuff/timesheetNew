// backend/fix-admin-role.js
/* eslint-disable no-console */
const { Sequelize, QueryTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: console.log,
});

async function ensureAdminRole(tx) {
  // Make sure role_name is unique so ON CONFLICT works predictably
  await sequelize.query(
    `
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexname = 'ux_role_masters_role_name'
      ) THEN
        CREATE UNIQUE INDEX ux_role_masters_role_name
          ON role_masters (role_name);
      END IF;
    END $$;
  `,
    { transaction: tx },
  );

  // Try to find an existing admin role (by level or name, case-insensitive)
  const roles = await sequelize.query(
    `
    SELECT id, role_name, level
    FROM role_masters
    WHERE level = 1 OR LOWER(role_name) = 'admin'
    ORDER BY level ASC
    LIMIT 1
  `,
    { type: QueryTypes.SELECT, transaction: tx },
  );

  if (roles.length > 0) return roles[0];

  // Create the admin role if none found (idempotent thanks to unique index)
  await sequelize.query(
    `
    INSERT INTO role_masters (role_name, level, description, is_active, created_at, updated_at)
    VALUES ('Admin', 1, 'Administrator with full access', TRUE, NOW(), NOW())
    ON CONFLICT (role_name) DO NOTHING;
  `,
    { transaction: tx },
  );

  const [created] = await sequelize.query(
    `
    SELECT id, role_name, level
    FROM role_masters
    WHERE level = 1 OR LOWER(role_name) = 'admin'
    ORDER BY level ASC
    LIMIT 1
  `,
    { type: QueryTypes.SELECT, transaction: tx },
  );

  return created;
}

async function ensureAdminUserHasRole(adminRole, tx) {
  // If your system guarantees this admin user exists, this just updates it.
  // If not, you can uncomment a create block below.
  await sequelize.query(
    `
    UPDATE users
    SET
      role = 'admin',              -- legacy column (safe to keep during transition)
      role_id = $1,
      updated_at = NOW()
    WHERE email = 'admin@company.com'
  `,
    { bind: [adminRole.id], transaction: tx },
  );

  // Optionally, ensure the user exists (uncomment to auto-create)
  // await sequelize.query(
  //   `
  //   INSERT INTO users (email, role, role_id, is_active, created_at, updated_at)
  //   SELECT 'admin@company.com', 'admin', $1, TRUE, NOW(), NOW()
  //   WHERE NOT EXISTS (
  //     SELECT 1 FROM users WHERE email = 'admin@company.com'
  //   )
  // `,
  //   { bind: [adminRole.id], transaction: tx }
  // );
}

async function reportAdminUser() {
  const user = await sequelize.query(
    `
    SELECT
      u.id,
      u.email,
      u.role AS legacy_role,
      u.role_id,
      rm.role_name,
      rm.level
    FROM users u
    LEFT JOIN role_masters rm ON u.role_id = rm.id
    WHERE u.email = 'admin@company.com'
  `,
    { type: QueryTypes.SELECT },
  );
  return user[0] || null;
}

async function fixAdminRole() {
  console.log('🔧 Fixing admin user role...\n');

  console.log('Current admin user status:');
  const before = await reportAdminUser();
  console.log(before || '— none —');
  console.log('');

  let result = { ok: false };

  await sequelize.transaction(async (tx) => {
    const adminRole = await ensureAdminRole(tx);
    console.log('Admin role:', adminRole);

    await ensureAdminUserHasRole(adminRole, tx);

    result.ok = true;
  });

  console.log('\nVerification - Updated admin user:');
  const after = await reportAdminUser();
  console.log(after || '— none —');

  console.log('\n✅ Admin role fixed successfully!');
  return result;
}

fixAdminRole()
  .then(() => sequelize.close())
  .catch((error) => {
    console.error('❌ Error fixing admin role:', error);
    sequelize
      .close()
      .then(() => process.exit(1))
      .catch(() => process.exit(1));
  });
