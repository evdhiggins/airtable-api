export class HttpError extends Error {
    public statusCode: number
    public statusText: string

    constructor(statusCode: number, statusText: string, message?: string) {
        super(message ?? statusText)
        this.statusCode = statusCode
        this.statusText = statusText
        Object.setPrototypeOf(this, new.target.prototype)
    }
}
