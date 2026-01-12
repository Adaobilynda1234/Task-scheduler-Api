const db = require("../config/database");

class Log {
  static async create(logData) {
    const { task_id, schedule_id, action, status, message, email_sent } =
      logData;

    const [result] = await db.execute(
      `INSERT INTO logs (task_id, schedule_id, action, status, message, email_sent) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        task_id,
        schedule_id || null,
        action,
        status,
        message,
        email_sent || false,
      ]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT l.*, t.title as task_title 
       FROM logs l 
       JOIN tasks t ON l.task_id = t.id 
       WHERE l.id = ?`,
      [id]
    );

    return rows[0];
  }

  static async findByTaskId(taskId, limit = 50) {
    const [rows] = await db.execute(
      `SELECT * FROM logs 
       WHERE task_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [taskId, limit]
    );

    return rows;
  }

  static async findByScheduleId(scheduleId) {
    const [rows] = await db.execute(
      "SELECT * FROM logs WHERE schedule_id = ? ORDER BY created_at DESC",
      [scheduleId]
    );

    return rows;
  }

  static async findRecent(limit = 100) {
    const [rows] = await db.execute(
      `SELECT l.*, t.title as task_title, t.user_id 
       FROM logs l 
       JOIN tasks t ON l.task_id = t.id 
       ORDER BY l.created_at DESC 
       LIMIT ?`,
      [limit]
    );

    return rows;
  }

  static async findByUserId(userId, limit = 50) {
    const [rows] = await db.execute(
      `SELECT l.*, t.title as task_title 
       FROM logs l 
       JOIN tasks t ON l.task_id = t.id 
       WHERE t.user_id = ? 
       ORDER BY l.created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );

    return rows;
  }

  static async getStatsByTaskId(taskId) {
    const [rows] = await db.execute(
      `SELECT 
         COUNT(*) as total_executions,
         SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
         SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
         SUM(CASE WHEN email_sent = TRUE THEN 1 ELSE 0 END) as emails_sent
       FROM logs 
       WHERE task_id = ?`,
      [taskId]
    );

    return rows[0];
  }
}

module.exports = Log;
