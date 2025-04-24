const getDateRange = (period) => {
  const today = new Date();
  let startDate = new Date();
  switch (period) {
    case "yesterday":
      startDate.setDate(today.getDate() - 1);
      break;
    case "week":
      startDate.setDate(today.getDate() - 7);
      break;
    case "year":
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    case "today":
    default:
      startDate = today;
      break;
  }

  // Ensure startDate and endDate are in "YYYY-MM-DD" format
  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(today),
  };
};
module.exports = { getDateRange };
