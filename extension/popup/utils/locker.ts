


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


type sR<T> = (result: T | Error) => boolean;

/**
 * The `RetryManager` class provides a mechanism to retry asynchronous operations
 * a specified number of times with a delay between retries. It allows you to
 * customize the retry logic by providing a custom retry condition.
 *
 * @example
 * ```typescript
 * async function asyncOperation() {
 *     // Perform some asynchronous work
 * }
 *
 * retryManager.withRetries(asyncOperation, 3, 100).then(result => {
 *     console.log('Operation completed');
 * });
 * ```
 */
class RetryManager {
    /**
     * Executes an asynchronous task a specified number of times with a delay between retries.
     *
     * @template T - The type of the result returned by the task.
     * @param {() => Promise<T>} task - The asynchronous task to be executed.
     * @param {number} retryCount - The number of times to retry the task.
     * @param {number} delayMs - The delay in milliseconds between retries.
     * @param {sR<T>} shouldRetry - A custom retry condition that determines whether to retry the task.
     * @returns {Promise<T>} A promise that resolves with the result of the task.
     */
    static async withRetries<T>(task: () => Promise<T>, retryCount: number = 5, delayMs: number = 100, shouldRetry: sR<T> = RetryManager.shouldRetry): Promise<T> {
        for (let attempt = 0; attempt < retryCount; attempt++) {
            try {
                const result = await task();
                if (!shouldRetry(result)) return result;
            } catch (error: unknown) {
                if (!shouldRetry(error as T | Error)) throw error;
            }
            if (attempt < retryCount - 1) await new Promise(res => setTimeout(res, delayMs));
        }
        return Promise.reject(new Error(`Operation failed after ${retryCount} attempts`));
    }

    /**
     * The default retry condition that retries the task if the result is null, undefined, or an error.
     *
     * @template T - The type of the result returned by the task.
     * @param {T | Error} result - The result of the task.
     * @returns {boolean} A boolean value indicating whether to retry the task.
     */
    private static shouldRetry<T>(result: T | Error): boolean {
        return result === null || result === undefined || result instanceof Error;
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
