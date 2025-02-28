import { describe, expect, it } from 'vitest';
import ReadableDate from './readabledate';

describe('ReadableDate', () => {
    describe('constructor', () => {
        it('should create an instance with a valid date string', () => {
            const dateString = '2023-10-01T12:00:00Z';
            const readableDate = new ReadableDate(dateString);
            expect(readableDate).toBeInstanceOf(ReadableDate);
        });

        it('should create an instance with a valid Date object', () => {
            const date = new Date();
            const readableDate = new ReadableDate(date);
            expect(readableDate).toBeInstanceOf(ReadableDate);
        });

        it('should throw a TypeError for an invalid date string', () => {
            expect(() => new ReadableDate('invalid-date')).toThrow(TypeError);
        });

        it('should throw a TypeError for an invalid date type', () => {
            expect(() => new ReadableDate(123 as never)).toThrow(TypeError);
        });
    });

    describe('format', () => {
        it('should format date as "Xh ago" if difference is less than or equal to 24 hours', () => {
            const date = new Date();
            date.setHours(date.getHours() - 5);
            const readableDate = new ReadableDate(date);
            expect(readableDate.format()).toBe('5h ago');
        });

        it('should format date as "Xd ago by HH:mm" if difference is less than or equal to 4 days', () => {
            const date = new Date();
            date.setDate(date.getDate() - 3);
            const readableDate = new ReadableDate(date);
            // const expectedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            // expect(readableDate.format()).toBe(`3d ago ${expectedTime}`);
            expect(readableDate.format()).toBe('3d ago');
        });

        it('should format date as "MMM DD HH:mm" if date is within the current year', () => {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            const readableDate = new ReadableDate(date);
            const expectedDate = date.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
            expect(readableDate.format()).toBe(expectedDate.replace(/,/g, ''));
        });

        it('should format date as "MMM DD, YYYY HH:mm" if date is in a past year', () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() - 1);
            const readableDate = new ReadableDate(date);
            const expectedDate = date.toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).replace(/,/g, '');
            expect(readableDate.format()).toBe(expectedDate);
        });
    });

    describe('static format', () => {
        it('should format a date string correctly', () => {
            const dateString = '2023-10-01T12:00:00Z';
            const formattedDate = ReadableDate.format(dateString);
            const readableDate = new ReadableDate(dateString);
            expect(formattedDate).toBe(readableDate.format());
        });

        it('should format a Date object correctly', () => {
            const date = new Date();
            const formattedDate = ReadableDate.format(date);
            const readableDate = new ReadableDate(date);
            expect(formattedDate).toBe(readableDate.format());
        });
    });
});
