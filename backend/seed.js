/**
 * seed.js — Insert demo users with properly hashed passwords.
 * Run once after importing schema.sql:
 *   node seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const users = [
  { first_name: 'Admin',  last_name: 'User',          email: 'admin@uoj.lk',         password: 'admin123',   role: 'ADMIN',             department: 'Computer Engineering' },
  { first_name: 'Head',   last_name: 'Of Department',  email: 'hod@uoj.lk',           password: 'hod123',     role: 'HOD',               department: 'Computer Engineering' },
  { first_name: 'Rajesh', last_name: 'Kumar',          email: 'rajesh@uoj.lk',        password: 'staff123',   role: 'LECTURER',          department: 'Computer Engineering' },
  { first_name: 'Priya',  last_name: 'Silva',          email: 'priya@uoj.lk',         password: 'staff123',   role: 'INSTRUCTOR',        department: 'Computer Engineering' },
  { first_name: 'Dinesh', last_name: 'Perera',         email: 'dinesh@uoj.lk',        password: 'to123',      role: 'TECHNICAL_OFFICER', department: 'Computer Engineering' },
  { first_name: 'Arun',   last_name: 'Nair',           email: 'arun@student.uoj.lk',  password: 'student123', role: 'STUDENT',           department: 'Computer Engineering' },
];

async function seed() {
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await new Promise((resolve, reject) => {
      db.query(
        `INSERT IGNORE INTO users (first_name, last_name, email, password, role, department, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [u.first_name, u.last_name, u.email, hash, u.role, u.department],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows > 0) {
            console.log(`✅ Inserted: ${u.email} (${u.role})`);
          } else {
            console.log(`⚠️  Skipped (already exists): ${u.email}`);
          }
          resolve();
        }
      );
    });
  }
  console.log('\n✅ Seed complete.');
  db.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  db.end();
  process.exit(1);
});
