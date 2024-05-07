import { RoleDTO } from "./RoleDTO";

export class CreateEmployeeRequest {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public roles: RoleDTO[],
    ){}
}