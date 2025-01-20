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
        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }

    /**
     * Checks if a user exists in the database.
     *
     * This method attempts to retrieve a user record by its ID from the 'users' table.
     * If a record is found, it returns `true`, otherwise it returns `false`.
     *
     * @returns {Promise<boolean>} A promise that resolves to `true` if the user exists, otherwise `false`.
     * @throws {Error} Throws an error if there is an issue with the database operation.
     */
    async exists(): Promise<boolean> {
        try {
            if (await Operator.getRecordById<IUser>('users', this.id))
                return true;
            return false;
        } catch (error) {
            throw new Error(`An error occurred in User.exists:- ${error}, ${this}`);
        }
    }
};
