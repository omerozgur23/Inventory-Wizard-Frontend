import { count } from 'rxjs';
export class CreateShelfRequest {
    constructor(
        public capacity: number,
        public count: number,
    ){}
}