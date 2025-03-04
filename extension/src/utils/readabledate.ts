/**
 * A utility class for formatting dates into human-readable strings.
 *
 * The `ReadableDate` class provides methods to format dates based on the difference
 * between the current date and the instance date. It supports various formats depending
 * on the time difference, such as "Just now", "X min ago", "an hour ago", "Xh ago", "Xd ago by HH:mm", "MMM DD HH:mm", and "MMM DD,YYYY HH:mm".
 *
 * @example
 * ```typescript
 * const readableDate = new ReadableDate('2023-10-01T12:00:00Z');
 * console.log(readableDate.format()); // Output will vary based on the current date
 *
 * const readableDateFromDate = new ReadableDate(new Date());
 * console.log(readableDateFromDate.format()); // Output: "Just now" (if run very quickly)
 *
 * console.log(ReadableDate.format('2023-10-01T12:00:00Z')); // Static method usage
 * ```
 *
 * @public
 */
export default class ReadableDate {
    private date: Date; // Private instance variable to hold the Date object

    constructor(dateString: string);
    constructor(date: Date);
    /**
     * Creates an instance of ReadableDate.
     *
     * @param date - The date to be used for the instance. It can be either a Date object or a string.
     * @throws {TypeError} If the provided date is not a valid date string or a Date object.
     */
    constructor(date: Date | string) {
        if (typeof date === 'string') {
            if (!this.validDate(date))
                throw new TypeError("ReadableDate.constructor: Invalid date string");
            this.date = new Date(date);
        } else if (date instanceof Date) {
            this.date = date;
        } else {
            throw new TypeError("ReadableDate.constructor: accepts a date object or string");
        }
    }

    /**
     * Checks if the provided date string is a valid date.
     *
     * @private
     * @param dateString - The date string to validate.
     * @returns `true` if the date string is valid, `false` otherwise.
     */
    private validDate(dateString: string): boolean {
        const parsedDate = Date.parse(dateString);
        return !isNaN(parsedDate); // Date.parse returns NaN for invalid date strings
    }

    /**
     * Formats the date into a readable string based on the difference between the current date and the instance date.
     *
     * The format varies depending on the time difference:
     * - If the difference is less than 1 minute, it returns "Just now".
     * - If the difference is less than 60 minutes, it returns a string in the format "X min ago".
     * - If the difference is less than 2 hours, it returns "an hour ago".
     * - If the difference is less than or equal to 24 hours, it returns a string in the format "Xh ago".
     * - If the difference is less than or equal to 4 days, it returns a string in the format "Xd ago by HH:mm".
     * - If the date is within the current year, it returns a string in the format "MMM DD HH:mm".
     * - If the date is in a past year, it returns a string in the format "MMM DD,YYYY HH:mm".
     *
     * @returns {string} The formatted date string.
     */
    public format(): string {
        const now = new Date();
        const diffInMs = now.getTime() - this.date.getTime();
        const diffInMinutes = diffInMs / (1000 * 60);
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;
        const currentYear = now.getFullYear();
        const dateYear = this.date.getFullYear();

        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 60) {
            return this.getMinutesAgoFormat(diffInMinutes);
        } else if (diffInHours < 2) {
            return "an hour ago";
        }
        else if (diffInHours <= 24) {
            return this.getHoursAgoFormat(diffInHours, diffInMinutes);
        } else if (diffInDays <= 4) {
            return this.getDaysAgoFormat(diffInDays);
        } else if (dateYear === currentYear) {
            return this.getMonthDayFormat();
        } else {
            return this.getMonthDayYearFormat();
        }
    }


    /**
     * Formats a given date into a readable string using the ReadableDate class.
     *
     * @param date - The date to format, either as a Date object or a string.
     * @returns The formatted date string.
     */
    public static format(date: Date | string): string {
        return date instanceof Date
            ? new ReadableDate(date).format()
            : new ReadableDate(date).format();
    }

    /**
     * Formats the given difference in hours into a human-readable string
     * representing the time elapsed in hours.
     *
     * For differences less than 2 hours, it returns "an hour ago" for values closer to 1 hour but greater than 1 min.
     * For differences less than 1 minute, it returns "Just now".
     * Otherwise, it returns a string in the format "Xh ago", rounded to the nearest hour.
     *
     * @private
     * @param diffInHours - The difference in hours to be formatted.
     * @param diffInMinutes - The difference in minutes to be formatted, used for finer granularity for very recent times.
     * @returns A string representing the time elapsed in hours, or "Just now" or "an hour ago" for recent times.
     */
    private getHoursAgoFormat(diffInHours: number, diffInMinutes: number): string {
        if (diffInMinutes < 1) {
            return "Just now";
        } else if (diffInMinutes < 120 && diffInHours < 2) { // Roughly within 2 hours, but more than 1 min
            if (diffInHours >= 1) {
                return "an hour ago"; // Approx. 1-2 hours - use "an hour ago"
            } else {
                return this.getMinutesAgoFormat(diffInMinutes); // Use minutes format if less than an hour
            }
        }
        const roundedHours = Math.round(diffInHours);
        return `${roundedHours}h ago`;
    }

    /**
     * Formats the given difference in minutes into a human-readable string
     * representing the time elapsed in minutes, in the format "X min ago".
     *
     * @private
     * @param diffInMinutes - The difference in minutes to be formatted.
     * @returns A string representing the time elapsed in minutes, rounded to the nearest minute.
     */
    private getMinutesAgoFormat(diffInMinutes: number): string {
        const roundedMinutes = Math.round(diffInMinutes);
        return `${roundedMinutes} min ago`;
    }


    /**
     * Formats the difference in days into a readable string in the format "Xd ago by HH:mm".
     *
     * @private
     * @param diffInDays - The difference in days to be formatted.
     * @returns A string representing the number of days ago and the time of day in HH:mm format.
     */
    private getDaysAgoFormat(diffInDays: number): string {
        const roundedDays = Math.round(diffInDays);
        // const timeFormat = this.getTimeInHHMM(); // Get time in HH:mm format
        // return `${roundedDays}d ago by ${timeFormat}`; // Corrected to include "by HH:mm"
        return `${roundedDays}d ago`; // Corrected to include "by HH:mm"
    }

    /**
     * Returns a formatted string representing the date in the format "MMM DD HH:MM".
     *
     * The month is abbreviated to three letters, the day is a numeric value, and the time is in HH:MM format.
     *
     * @private
     * @returns {string} The formatted date string.
     */
    private getMonthDayFormat(): string {
        const expected = this.date.toLocaleString('en-US', {
            month: 'short', // Abbreviated month
            day: '2-digit', // 2-digit day
            hour: '2-digit', // 2-digit hour
            minute: '2-digit', // 2-digit minute
            hour12: false, // 24-hour format
        }); // Get date in MMM DD HH:MM format (e.g., "Oct 01, 12:00")
        return expected.replace(/,/g, '');
    }

    /**
     * Formats the current date object into a string with the format "MMM DD,YYYY HH:MM".
     *
     * @private
     * @returns {string} A string representing the formatted date and time.
     */
    private getMonthDayYearFormat(): string {
        const month = this.date.toLocaleString('en-US', { month: 'short', day: '2-digit' })
            .replace(/,/g, '');
        const year = this.date.toLocaleString('en-US', { year: '2-digit' });
        return `${month}, ${year}`; // "Mar 04, 24"
    }

    public getMonthDayYearTime(): string {
        const month = this.date.toLocaleString('en-US', { month: 'short', day: '2-digit' })
            .replace(/,/g, '');
        const year = this.date.toLocaleString('en-US', { year: '2-digit' });
        return `${month}, ${year} ${this.getTimeInHHMM()}`; // "Mar 04, 24 20:00"
    }

    /**
     * Converts the time from the `date` object to a string formatted as HH:MM.
     * The hours and minutes are zero-padded to ensure two digits.
     *
     * @private
     * @returns {string} The formatted time string in HH:MM format.
     */
    private getTimeInHHMM(): string {
        const hours = String(this.date.getHours()).padStart(2, '0');
        const minutes = String(this.date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Converts the date to an ISO 8601 string representation.
     *
     * @returns {string} The ISO 8601 string representation of the date.
     */
    public toISOString(): string {
        return this.date.toISOString();
    }

    /**
     * Converts a given date to an ISO string.
     *
     * @param date - The date to be converted. It can be a Date object or a string.
     * @returns The ISO string representation of the date.
     */
    public static toISOString(date: Date | string): string {
        return date instanceof Date
            ? date.toISOString()
            : new ReadableDate(date).toISOString();
    }
}
