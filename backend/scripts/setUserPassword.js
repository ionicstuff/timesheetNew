const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");
const path = require("path");

// Always load env from backend/.env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Reuse the project's Sequelize instance
const sequelize = require("../config/database");

async function main() {
  const args = process.argv.slice(2);
  const emailArgIndex = args.findIndex((a) => a === "--email" || a === "-e");
  const passArgIndex = args.findIndex((a) => a === "--password" || a === "-p");

  if (emailArgIndex === -1 || passArgIndex === -1) {
    console.error(
      "Usage: node scripts/setUserPassword.js --email <email> --password <newPassword>",
    );
    process.exit(1);
  }

  const email = args[emailArgIndex + 1];
  const newPasswordPlain = args[passArgIndex + 1];

  if (!email || !newPasswordPlain) {
    console.error("Both --email and --password values are required.");
    process.exit(1);
  }

  try {
    console.log(`🔐 Updating password for user: ${email}`);
    // Hash with cost 12 (matches model)
    const hash = await bcrypt.hash(newPasswordPlain, 12);

    const [result] = await sequelize.query(
      `UPDATE users
       SET password_hash = $1,
           is_active = TRUE,
           updated_at = NOW()
       WHERE lower(email) = lower($2)
       RETURNING id, email`,
      { bind: [hash, email] },
    );

    if (!result || result.length === 0) {
      console.error("❌ No user found with that email.");
      process.exit(2);
    }

    console.log(
      `✅ Password updated for: ${result[0].email} (id=${result[0].id})`,
    );
  } catch (err) {
    console.error("❌ Failed to update password:", err.message || err);
    process.exit(3);
  } finally {
    await sequelize.close();
  }
}

main();
