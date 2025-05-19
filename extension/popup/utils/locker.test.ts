import { describe, expect, it, vi } from 'vitest';
import { lockManager, queueManager, retryManager } from './locker';

describe('LockManager', () => {
    it('should acquire a lock and execute the task', async () => {
        const task = vi.fn().mockResolvedValue('task result');
        const result = await lockManager.acquire('test-lock', task);
        expect(result).toBe('task result');
        expect(task).toHaveBeenCalledTimes(1);
    });

    it('should return the result of an ongoing task if a lock is already acquired', async () => {
        const task = vi.fn().mockResolvedValue('task result');
        lockManager.acquire('test-lock', task);
        const result = await lockManager.acquire('test-lock', task);
        expect(result).toBe('task result');
        expect(task).toHaveBeenCalledTimes(1);
    });
});

describe('RetryManager', () => {
    it('should execute the task successfully without retries', async () => {
        const task = vi.fn().mockResolvedValue('task result');
        const result = await retryManager.withRetries(task);
        expect(result).toBe('task result');
        expect(task).toHaveBeenCalledTimes(1);
    });

    it('should retry the task if it fails', async () => {
        const task = vi.fn()
            .mockRejectedValueOnce(new Error('first attempt failed'))
            .mockResolvedValue('task result');
        const result = await retryManager.withRetries(task, 3, 100);
        expect(result).toBe('task result');
        expect(task).toHaveBeenCalledTimes(2);
    });

    it('should fail after the maximum number of retries', async () => {
        const task = vi.fn().mockRejectedValue(new Error('task failed'));
        await expect(retryManager.withRetries(task, 3, 100)).rejects.toThrow('Operation failed after 3 attempts');
        expect(task).toHaveBeenCalledTimes(3);
    });

    it('should retry based on the custom retry condition', async () => {
        const task = vi.fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(undefined)
            .mockRejectedValueOnce(new Error('task failed'))
            .mockResolvedValue('task result');

        function shouldRetry(r: unknown) {
            return r === null || r === undefined || r instanceof Error;
        }

        const result = await retryManager.withRetries(task, 5, 100, shouldRetry);

        expect(result).toBe('task result');
        expect(task).toHaveBeenCalledTimes(4);
    });

    it('should retry based on the custom retry condition for errors', async () => {
        const task = vi.fn()
            .mockResolvedValueOnce(new Error('task failed'))
            .mockResolvedValue('task result');
        const shouldRetry = (result: unknown) => result instanceof Error;
        const result = await retryManager.withRetries(task, 3, 100, shouldRetry);
        expect(result).toBe('task result');
        expect(task).toHaveBeenCalledTimes(2);
    });

    it('should ensure delay between retries', async () => {
        const task = vi.fn()
            .mockRejectedValueOnce(new Error('first attempt failed')) // 1st attempt fails
            .mockResolvedValue('task result'); // 2nd attempt succeeds

        const startTime = performance.now();
        await retryManager.withRetries(task, 3, 100); // Default shouldRetry
        const endTime = performance.now();

        expect(endTime - startTime).toBeGreaterThanOrEqual(100); // 1 retry * 100ms delay
    });


});

describe('QueueManager', () => {
    it('should enqueue and execute tasks sequentially', async () => {
        const results: string[] = [];
        const task1 = vi.fn().mockImplementation(async () => {
            results.push('task1');
        });
        const task2 = vi.fn().mockImplementation(async () => {
            results.push('task2');
        });

        await queueManager.enqueue(task1);
        await queueManager.enqueue(task2);

        expect(results).toEqual(['task1', 'task2']);
        expect(task1).toHaveBeenCalledTimes(1);
        expect(task2).toHaveBeenCalledTimes(1);
    });

    it('should handle task failures and continue with the next task', async () => {
        const results: string[] = [];
        const task1 = vi.fn().mockImplementation(async () => {
            results.push('task1');
        });
        const task2 = vi.fn().mockRejectedValue(new Error('task2 failed'));
        const task3 = vi.fn().mockImplementation(async () => {
            results.push('task3');
        });

        await queueManager.enqueue(task1);
        await expect(queueManager.enqueue(task2)).rejects.toThrow('task2 failed');
        await queueManager.enqueue(task3);

        expect(results).toEqual(['task1', 'task3']);
        expect(task1).toHaveBeenCalledTimes(1);
        expect(task2).toHaveBeenCalledTimes(1);
        expect(task3).toHaveBeenCalledTimes(1);
    });
});

