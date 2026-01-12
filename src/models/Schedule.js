const db = require("../config/database");

class Schedule {
  static async create(scheduleData) {
    const { task_id, scheduled_time } = scheduleData;

    const [result] = await db.execute(
      "INSERT INTO schedules (task_id, scheduled_time) VALUES (?, ?)",
      [task_id, scheduled_time]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT s.*, t.title as task_title, t.description as task_description 
       FROM schedules s 
       JOIN tasks t ON s.task_id = t.id 
       WHERE s.id = ?`,
      [id]
    );

    return rows[0];
  }

  static async findByTaskId(taskId) {
    const [rows] = await db.execute(
      "SELECT * FROM schedules WHERE task_id = ? ORDER BY scheduled_time DESC",
      [taskId]
    );

    return rows;
  }

  static async findPendingSchedules() {
    const [rows] = await db.execute(
      `SELECT s.*, t.title, t.description, t.user_id, u.email, u.name as user_name
       FROM schedules s
       JOIN tasks t ON s.task_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE s.executed = FALSE 
       AND s.scheduled_time <= NOW()
       ORDER BY s.scheduled_time ASC`
    );

    return rows;
  }

  static async markAsExecuted(id) {
    const [result] = await db.execute(
      "UPDATE schedules SET executed = TRUE, executed_at = NOW() WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }

  static async updateById(id, scheduleData) {
    const { scheduled_time } = scheduleData;

    const [result] = await db.execute(
      "UPDATE schedules SET scheduled_time = ?, executed = FALSE, executed_at = NULL WHERE id = ?",
      [scheduled_time, id]
    );

    return result.affectedRows > 0;
  }

  static async deleteById(id) {
    const [result] = await db.execute("DELETE FROM schedules WHERE id = ?", [
      id,
    ]);

    return result.affectedRows > 0;
  }

  static async getUpcomingSchedules(userId, limit = 10) {
    const [rows] = await db.execute(
      `SELECT s.*, t.title, t.description 
       FROM schedules s
       JOIN tasks t ON s.task_id = t.id
       WHERE t.user_id = ? 
       AND s.executed = FALSE 
       AND s.scheduled_time > NOW()
       ORDER BY s.scheduled_time ASC
       LIMIT ?`,
      [userId, limit]
    );

    return rows;
  }
}

module.exports = Schedule;
