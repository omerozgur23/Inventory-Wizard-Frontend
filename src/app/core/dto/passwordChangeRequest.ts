export class PasswordChangeRequest {
    constructor(
        public lastPassword: string,
        public newPassword: string,
    ){}
}