const getDateRange = (range) => {
  const now = new Date();
  let start;
  let end = new Date(); // Use a copy for end date

  switch (range) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly": {
      // FIXED: Don't mutate the original date
      const tempDate = new Date(now);
      const firstDayOfWeek = tempDate.getDate() - tempDate.getDay();
      start = new Date(tempDate.setDate(firstDayOfWeek));
      // Reset time to start of day
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1); // default monthly
  }

  // Ensure start is at beginning of day
  start.setHours(0, 0, 0, 0);
  // Ensure end is at end of day
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export default getDateRange;