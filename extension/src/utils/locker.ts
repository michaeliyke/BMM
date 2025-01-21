

import { getFuncName } from "./domHelpers";

/**
 * The `LockManager` class provides a mechanism to manage and synchronize tasks
 * identified by unique ids, ensuring that each task is executed only once at a time
 * for the same id. It uses a map to store locks and returns the result of ongoing tasks
 * if a task with the same id is already in progress.
 *
 * @example
 * ```typescript
 * const lockManager = new LockManager();
 *
 * async function myTask() {
 *   // some asynchronous operation
 * }
 *
 * const result = await lockManager.acquire('unique-task-id', myTask);
 * ```
 */
class LockManager {
    private locks: Map<string, Promise<unknown>> = new Map();

    /**
     * Generates a lock key based on the provided identifier.
     *
     * @param id - The identifier to generate the lock key for.
     * @returns A string representing the lock key.
     */
    private getLockKey(id: string): string {
        return `${id}`;
    }

    /**
     * Acquires a lock for a given task identified by a unique id and ensures that
     * the task is executed only once at a time for the same id. If a task with the
     * same id is already in progress, it returns the result of the ongoing task.
     *
     * @template T - The type of the result returned by the task.
     * @param {string} id - A unique identifier for the task.
     * @param {() => Promise<T>} task - A function that returns a promise representing the task to be executed.
     * @returns {Promise<T>} - A promise that resolves to the result of the task.
     */
    async acquire<T>(id: string, task: () => Promise<T>): Promise<T> {
        // id is a unique identifier for the task

        const key = this.getLockKey(id);  // make a key string

        // If a task is already in the pipeline, return its result (Promise)
        if (this.locks.has(key)) {
            return this.locks.get(key) as Promise<T>;
        }

        // Create a new lock
        const currentLock = (async () => {
            try { // Execute the task and return its result
                return await task();
            } finally { // Remove the lock once the task is completed
                this.locks.delete(key);
            }
        })();

        // Store the current lock in the map
        this.locks.set(key, currentLock);
        // Wait for the current lock to complete and return its result
        return currentLock;
    }
}


/**
 * Retries an asynchronous operation with exponential backoff.
 *
 * @param attempt - The current attempt number (starting from 0).
 * @param retryCount - The maximum number of retry attempts.
 * @param delayMs - The initial delay in milliseconds before retrying.
 * @param error - The error that caused the retry.
 * @returns A promise that resolves if the operation eventually succeeds, or rejects with the last error if all attempts fail.
 */
async function retry(attempt: number, retryCount: number, delayMs: number, error: Error): Promise<void> {
    console.log(`Attempt ${attempt + 1} failed: ${error}`);
    if (attempt < retryCount - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2;  // Exponential backoff like 100ms, 200ms, 400ms, 800ms, 1600ms
    } else {
        console.log(`Operation failed after ${retryCount} attempts`);
        return Promise.reject(error);
    }
}

/**
 * A utility class that provides a mechanism to execute an asynchronous task with retries.
 */
class RetryManager {
    /**
     * Executes a given asynchronous task with a specified number of retries and delay between retries.
     *
     * @template T - The type of the result returned by the task.
     * @param {() => Promise<T>} task - The asynchronous task to be executed.
     * @param {number} [retryCount=5] - The number of times to retry the task if it fails. Defaults to 5.
     * @param {number} [delayMs=100] - The delay in milliseconds between retries. Defaults to 100ms.
     * @returns {Promise<T>} - A promise that resolves to the result of the task if it succeeds within the given retries, or rejects with an error if all retries fail.
     * @throws {Error} - Throws an error if the task fails after the specified number of retries.
     */
    static async withRetries<T>(task: () => Promise<T>, retryCount: number = 5, delayMs: number = 100): Promise<T> {
        for (let attempt = 0; attempt < retryCount; attempt++) {
            try {
                // Return result if task succeeds, and retry on error.
                const result = await task();
                console.log(`result(${getFuncName()}):`, result);
                if (result)
                    return result;
                await retry(attempt, retryCount, delayMs, new Error("Retrying..."));
            } catch (error) {
                if (error instanceof Error)
                    await retry(attempt, retryCount, delayMs, error);
            }
        }
        // This line should never be reached unless retryCount is 0 or negative
        return Promise.reject(new Error(`Operation failed after ${retryCount} attempts`));
    }
}

/**
 * Manages a queue of asynchronous operations, ensuring that they are executed sequentially.
 *
 * The `QueueManager` class allows you to enqueue asynchronous operations (functions that return a `Promise`)
 * and ensures that only one operation is executed at a time. This is useful for scenarios where you need to
 * serialize access to a resource or ensure that operations are performed in a specific order.
 *
 * @example
 * ```typescript
 * const queueManager = new QueueManager();
 *
 * async function asyncOperation() {
 *     // Perform some asynchronous work
 * }
 *
 * queueManager.enqueue(asyncOperation).then(() => {
 *     console.log('Operation completed');
 * });
 * ```
 */
class QueueManager {
    /**
     * A queue of functions that return a Promise<void>.
     * These functions are executed sequentially to ensure that only one function
     * is running at a time.
     */
    private queue: (() => Promise<void>)[] = [];
    private isProcessing = false;

    /**
     * Adds an asynchronous operation to the queue and ensures that operations are processed sequentially.
     *
     * @template T - The type of the result returned by the operation.
     * @param {() => Promise<T>} operation - The asynchronous operation to be enqueued.
     * @returns {Promise<T>} A promise that resolves with the result of the operation.
     */
    async enqueue<T>(operation: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                operation()
                    .then(resolve)
                    .catch(reject)
                    .finally(this.processNext.bind(this));
            });

            if (!this.isProcessing) {
                this.processNext();
            }
        });
    }

    /**
     * Processes the next operation in the queue if available.
     *
     * If there are operations in the queue, it sets `isProcessing` to true,
     * removes the next operation from the queue, and executes it.
     * If the queue is empty, it sets `isProcessing` to false.
     *
     * @returns {Promise<void>} A promise that resolves when the next operation is processed.
     */
    async processNext() {
        if (this.queue.length > 0) {
            this.isProcessing = true;
            const nextOperation = this.queue.shift();
            if (nextOperation) {
                await nextOperation();
            }
        } else {
            this.isProcessing = false;
        }
    }
}

export const lockManager = new LockManager();
export const queueManager = new QueueManager();
export const retryManager = RetryManager;
