const db = require("../config/database");

class Task {
  static async create(taskData) {
    const { user_id, title, description } = taskData;

    const [result] = await db.execute(
      "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [user_id, title, description, "scheduled"]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT t.*, u.name as user_name, u.email as user_email 
       FROM tasks t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [id]
    );

    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT t.*, s.scheduled_time, s.executed 
       FROM tasks t 
       LEFT JOIN schedules s ON t.id = s.task_id 
       WHERE t.user_id = ? 
       ORDER BY t.created_at DESC`,
      [userId]
    );

    return rows;
  }

  static async findAll() {
    const [rows] = await db.execute(
      `SELECT t.*, u.name as user_name, u.email as user_email 
       FROM tasks t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC`
    );

    return rows;
  }

  static async updateById(id, taskData) {
    const fields = [];
    const values = [];

    if (taskData.title !== undefined) {
      fields.push("title = ?");
      values.push(taskData.title);
    }

    if (taskData.description !== undefined) {
      fields.push("description = ?");
      values.push(taskData.description);
    }

    if (taskData.status !== undefined) {
      fields.push("status = ?");
      values.push(taskData.status);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await db.execute(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    const [result] = await db.execute("DELETE FROM tasks WHERE id = ?", [id]);

    return result.affectedRows > 0;
  }

  static async verifyOwnership(taskId, userId) {
    const [rows] = await db.execute(
      "SELECT id FROM tasks WHERE id = ? AND user_id = ?",
      [taskId, userId]
    );

    return rows.length > 0;
  }
}

module.exports = Task;
