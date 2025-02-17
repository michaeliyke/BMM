export default class ReadableDate {
    private date: Date; // Private instance variable to hold the Date object

    constructor(isoDateString: string) {
        // Constructor to accept ISO date string
        this.date = new Date(isoDateString);
        // TODO: Add validation to ensure isoDateString is a valid ISO format
    }

    // Instance method to get the readable date string
    public toReadableString(): string {
        const now = new Date();
        const diffInMs = now.getTime() - this.date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;
        const currentYear = now.getFullYear();
        const dateYear = this.date.getFullYear();

        if (diffInHours <= 24) {
            return this.getHoursAgoFormat(diffInHours); // Private method for "Xh ago"
        } else if (diffInDays <= 4) {
            return this.getDaysAgoFormat(diffInDays); // Private method for "Xd ago by HH:mm"
        } else if (dateYear === currentYear) {
            return this.getMonthDayFormat(); // Private method for "MMM DD HH:mm" (current year)
        } else {
            return this.getMonthDayYearFormat(); // Private method for "MMM DD, YYYY HH:mm" (past years)
        }
    }

    // Static method for direct call - accepting ISO date string and returning readable string
    public static format(isoDateString: string): string {
        const readableDate = new ReadableDate(isoDateString);
        return readableDate.toReadableString();
    }

    // --- Private methods for formatting logic ---

    private getHoursAgoFormat(diffInHours: number): string {
        const roundedHours = Math.round(diffInHours); // Or floor/ceil depending on desired rounding
        return `${roundedHours}h ago`;
    }

    private getDaysAgoFormat(diffInDays: number): string {
        const roundedDays = Math.round(diffInDays); // Or floor/ceil
        const timeFormat = this.getTimeInHHMM(); // Get time in HH:mm format
        return `${roundedDays}d ago by ${timeFormat}`;
    }

    private getMonthDayFormat(): string {
        const month = this.date.toLocaleString('en-US', { month: 'short' }); // Abbreviated month
        const day = this.date.getDate();
        const timeFormat = this.getTimeInHHMM();
        return `${month} ${day} ${timeFormat}`;
    }

    private getMonthDayYearFormat(): string {
        const month = this.date.toLocaleString('en-US', { month: 'short' }); // Abbreviated month
        const day = this.date.getDate();
        const year = this.date.getFullYear();
        const timeFormat = this.getTimeInHHMM();
        return `${month} ${day}, ${year} ${timeFormat}`;
    }

    private getTimeInHHMM(): string {
        const hours = String(this.date.getHours()).padStart(2, '0');
        const minutes = String(this.date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
