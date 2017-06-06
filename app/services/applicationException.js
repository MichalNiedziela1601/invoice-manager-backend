'use strict';

function ApplicationException(error, message)
{
    this.error = error;
    this.message = message;
}

module.exports = {
    REQUEST_FAILED: {message: 'REQUEST_FAILED', code: 402},
    NOT_FOUND: {message: 'NOT_FOUND', code: 404},
    FORBIDDEN: {message: 'FORBIDDEN', code: 403},
    UNAUTHORIZED: {message: 'UNAUTHORIZED', code: 401},
    VALIDATION_FAILURE: {message: 'VALIDATION_FAILURE', code: 406},
    METHOD_NOT_ALLOWED: {message: 'METHOD_NOT_ALLOWED', code: 405},
    REQUEST_TIMEOUT: {message: 'REQUEST_TIMEOUT', code: 408},
    PRECONDITION_FAILED: {message: 'PRECONDITION_FAILED', code: 412},
    CONFLICT: {message: 'CONFLICT', code: 409},
    CONTENT_GONE: {message: 'CONTENT_GONE', code: 410},
    ERROR: {message: 'ERROR', code: 500},
    is: function (error, errorCode)
    {
        return error instanceof ApplicationException &&
                (null == errorCode || error.error === errorCode.code || error.error && error.error.code === errorCode.code);
    },
    new: function (code, message)
    {
        return new ApplicationException(code, message);
    },
    errorHandler: function (error, reply)
    {
        if (error instanceof ApplicationException) {
            reply(error.message.detail || error.message || error.error.message || 'Unknown error').code(error.error.code);
        }
        else {
            reply(error).code(500);
            console.error(error);
        }
    }
};
