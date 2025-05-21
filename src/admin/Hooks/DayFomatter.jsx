/**
 * Formats a comma-separated list of days into a concise, readable format
 * 
 * @param {string} daysString - Comma-separated list of days (e.g., "Monday,Tuesday,Wednesday")
 * @returns {string} Formatted string
 * 
 * Rules:
 * - Return "Closed" if no days are provided
 * - Return "Everyday" if all 7 days are provided
 * - Return the days separated by ", " if 1 to 4 days are provided
 * - Return "Everyday except <missing days>" if 5 or 6 days are provided
 */
const DayFormatter = (daysString) => {
    if (!daysString || daysString.trim() === "") {
        return "Closed";
    }

    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const inputDays = daysString.split(",")
        .map(day => day.trim())
        .filter(day => day); // remove empty strings

    // Remove duplicates
    const uniqueDays = [...new Set(inputDays)];

    // Sort days according to the week
    const sortedDays = [...uniqueDays].sort(
        (a, b) => allDays.indexOf(a) - allDays.indexOf(b)
    );

    if (sortedDays.length === 7) {
        return "Everyday";
    }

    if (sortedDays.length >= 1 && sortedDays.length <= 4) {
        return sortedDays.join(", ");
    }

    if (sortedDays.length === 5 || sortedDays.length === 6) {
        const missingDays = allDays.filter(day => !sortedDays.includes(day));
        return `Everyday except ${missingDays.join(", ")}`;
    }

    return "Closed"; // fallback
};

export default DayFormatter;
