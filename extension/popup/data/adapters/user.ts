import { isEmpty } from "../../utils/common";
import { IUser } from "../../utils/types/schemas";
import { Operator } from "../operator";

export default class User implements IUser {
    id: string;
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;

    constructor(user: IUser) {
        this.id = user.id; /* uuid4(); */
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.created_at = user.created_at; /* new Date().toISOString(); */
        this.updated_at = user.updated_at; /* new Date().toISOString(); */

        const empty = isEmpty(['id', 'password', 'email', 'created_at', 'updated_at'], user);
        if (empty) throw new Error(`User.constructor:- Required field: ${empty}`);
    }

    /**
     * Checks if a user exists in the database.
     *
     * This method attempts to retrieve a user record by its ID from the 'users' table.
     * If a record is found, it returns `true`, otherwise it returns `false`.
     *
     * @returns {Promise<IUser|null>} A promise that resolves to the user object if it exists, otherwise `null`.
     * @throws {Error} Throws an error if there is an issue with the database operation.
     */
    async exists(): Promise<IUser | null> {
        try {
            return await Operator.getRecordById<IUser>('users', this.id) || null;
        } catch (error) {
            throw new Error(`An error occurred in User.exists:- ${error}, ${this}`);
        }
    }
};
