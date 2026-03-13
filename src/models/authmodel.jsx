/**
 * Represents login credentials.
 */
export class AuthModel {
    constructor(userName, password) {
        this.user_name = userName;
        this.password = password;
    }

    /**
     * Returns a JSON representation suitable for API submission.
     */
    toJSON() {
        return {
            user_name: this.user_name,
            password: this.password,
        };
    }
}