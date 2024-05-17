import { RoleDTO } from "./RoleDTO";

export class UpdateEmployeeRequest {
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public roles: RoleDTO[],
    ){}
}