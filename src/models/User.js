const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async create(userData) {
    const { name, email, password } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    return rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateById(id, userData) {
    const fields = [];
    const values = [];

    if (userData.name) {
      fields.push("name = ?");
      values.push(userData.name);
    }

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await db.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);

    return result.affectedRows > 0;
  }
}

module.exports = User;
