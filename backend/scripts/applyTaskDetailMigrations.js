const sequelize = require('../config/database');

async function run() {
  const qi = sequelize.getQueryInterface();
  try {
    // Ensure SequelizeMeta exists
    await sequelize.query(
      'CREATE TABLE IF NOT EXISTS "SequelizeMeta" ("name" VARCHAR(255) NOT NULL UNIQUE, PRIMARY KEY ("name"));',
    );

    const migrations = [
      {
        name: '20250919_001_create_task_comments.js',
        mod: require('../migrations/20250919_001_create_task_comments'),
      },
      {
        name: '20250919_002_create_task_files.js',
        mod: require('../migrations/20250919_002_create_task_files'),
      },
      {
        name: '20250919_003_create_task_dependencies.js',
        mod: require('../migrations/20250919_003_create_task_dependencies'),
      },
      {
        name: '20250919_004_create_task_activities.js',
        mod: require('../migrations/20250919_004_create_task_activities'),
      },
      {
        name: '20250919_005_create_task_comment_likes.js',
        mod: require('../migrations/20250919_005_create_task_comment_likes'),
      },
    ];

    // Fetch applied migrations
    const [rows] = await sequelize.query('SELECT name FROM "SequelizeMeta"');
    const applied = new Set(rows.map((r) => r.name));

    for (const { name, mod } of migrations) {
      if (applied.has(name)) {
        console.log(`Skipping ${name} (already applied)`);
        continue;
      }
      console.log(`Applying ${name}...`);
      await mod.up(qi, sequelize.constructor);
      await qi.bulkInsert('SequelizeMeta', [{ name }]);
      console.log(`Applied ${name}`);
    }

    console.log('All task detail migrations applied.');
  } catch (err) {
    console.error('Migration error:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
