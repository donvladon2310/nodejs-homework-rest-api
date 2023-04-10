class HttpError extends Error {
    constructor(status, message) {
        super(message || errorMesssages[status]);
        this.name = 'HttpError';
        this.status = status;
    }
}

const errorMesssages = {
    400: "missing fields",
    404: "Not found",
};

module.exports = HttpError;


