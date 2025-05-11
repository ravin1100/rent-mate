export const parseCustomDateString = (dateString: string): Date => {
  console.log('Parsing dateString:', dateString);
  // Format: MM-DD-YYYY HH:MM:SS AM/PM
  const parts = dateString.match(/(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/i);
  console.log('Regex match parts:', parts);
  if (!parts) {
    return new Date(dateString); // Fallback to default parser if regex fails
  }

  const [, month, day, year, hourStr, minute, second, ampm] = parts;
  let hour = parseInt(hourStr, 10);

  if (ampm.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  }
  if (ampm.toUpperCase() === "AM" && hour === 12) {
    hour = 0; // Midnight case
  }

  // Month is 0-indexed in JavaScript Date objects
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hour, parseInt(minute, 10), parseInt(second, 10));
};
