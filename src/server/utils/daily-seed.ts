/**
 * Generate a daily seed based on a UTC date
 * Format: YYYYMMDD as a number (e.g., 20260212)
 * @param date - Optional date to use. If not provided, uses current date.
 */
export function getDailySeedFromDate(date?: Date): number {
	const now = date || new Date();
	// Using UTC to ensure consistency across timezones
	const year = now.getUTCFullYear();
	const month = now.getUTCMonth() + 1; // 0-indexed, so add 1
	const day = now.getUTCDate();
	return year * 10000 + month * 100 + day;
}
