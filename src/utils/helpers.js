const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  return date > new Date();
};

const sanitizeUser = (user) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

const createResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return response;
};

module.exports = {
  formatDateTime,
  isValidDate,
  isFutureDate,
  sanitizeUser,
  createResponse,
};
