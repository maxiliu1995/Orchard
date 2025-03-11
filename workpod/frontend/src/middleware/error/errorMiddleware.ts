interface ErrorResponse {
    status: number;
    message: string;
}

export const errorMiddleware = {
    async handleError(error: any): Promise<ErrorResponse> {
        if (error.status) {
            return {
                status: error.status,
                message: error.message || 'An error occurred'
            };
        }
        
        return {
            status: 500,
            message: 'Internal server error'
        };
    }
};
