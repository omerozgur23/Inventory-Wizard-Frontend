export interface GetEmployeeResponse{
    count: number,
    data: [
        {
            id: string,
            firstName: string,
            lastName: string,
            email: string,
            password: string,
            role: string,
        }
    ]
}