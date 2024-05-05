export interface GetShelfResponse {
    count: number,
    data:[
        {
            id: string,
            count: number,
            capacity: number,
            productName: string
        }
    ]
}