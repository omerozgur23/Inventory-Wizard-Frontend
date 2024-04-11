export class UpdateShelf {
    constructor(
        public id: string,
        public count: number,
        public capacity: number,
        public productName: string,
    ) {}
}