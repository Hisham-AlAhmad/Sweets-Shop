/**
 * Formats a comma-separated list of days into a concise, readable format
 * 
 * @param {string} daysString - Comma-separated list of days (e.g., "Monday,Tuesday,Wednesday")
 * @returns {string} Formatted string (e.g., "Monday - Wednesday")
 */
const DayFomatter = (daysString) => {
    // Handle special cases
    if (!daysString || daysString.trim() === "") {
        return "";
    }

    if (daysString.toLowerCase() === "everyday") {
        return "Everyday";
    }

    // Parse days into an array and remove any empty entries
    const daysArray = daysString.split(",")
        .map(day => day.trim())
        .filter(day => day !== "");

    // If no valid days, return empty string
    if (daysArray.length === 0) {
        return "";
    }

    // If all 7 days are present, return "Everyday"
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const sortedDays = [...daysArray].sort((a, b) =>
        allDays.indexOf(a) - allDays.indexOf(b)
    );

    if (sortedDays.length === 7) {
        return "Everyday";
    }

    // Create a map for day indices
    const dayIndices = {};
    allDays.forEach((day, index) => {
        dayIndices[day] = index;
    });

    // Convert days to their numerical indices (0 = Monday, 6 = Sunday)
    const dayNumbers = sortedDays.map(day => dayIndices[day]);

    // Find consecutive ranges
    const ranges = [];
    let rangeStart = dayNumbers[0];
    let rangeEnd = dayNumbers[0];

    for (let i = 1; i < dayNumbers.length; i++) {
        // Check if current day is consecutive with previous day
        // (accounting for wrapping from Sunday to Monday)
        const isContinuous =
            (dayNumbers[i] === rangeEnd + 1) ||
            (rangeEnd === 6 && dayNumbers[i] === 0);

        if (isContinuous) {
            rangeEnd = dayNumbers[i];
        } else {
            // End of a range, store it
            ranges.push([rangeStart, rangeEnd]);
            rangeStart = dayNumbers[i];
            rangeEnd = dayNumbers[i];
        }
    }

    // Add the last range
    ranges.push([rangeStart, rangeEnd]);

    // Format each range
    const formattedRanges = ranges.map(([start, end]) => {
        if (start === end) {
            return allDays[start];
        } else {
            return `${allDays[start]} - ${allDays[end]}`;
        }
    });

    // Join all ranges with commas
    return formattedRanges.join(", ");
};

export default DayFomatter;