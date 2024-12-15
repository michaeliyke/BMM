

import { getFuncName } from "./domHelpers";

export class LockManager {
    private locks: Map<string, Promise<unknown>> = new Map();

    private getLockKey(id: string): string {
        return `${id}`;
    }

    async acquire<T>(id: string, task: () => Promise<T>): Promise<T> {
        const key = this.getLockKey(id);  // make a key string
        // Get the previous operation of the same key or a resolved promise
        const previousLock = this.locks.get(key);

        const currentLock = (async () => {
            try {
                // Wait for the previous operation to complete
                if (previousLock)
                    await previousLock;
                // Execute the task
                return await task();
            } finally {
                // Remove the lock when the task is completed
                this.locks.delete(key);
            }
        })();

        // Store the current lock
        this.locks.set(key, currentLock);
        // Wait for the current lock to complete
        return await currentLock;
    }
}


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

export class RetryManager {
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

export class QueueManager {
    private queue: (() => Promise<void>)[] = [];
    private isProcessing = false;

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
