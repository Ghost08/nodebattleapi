'use strict';

function response(status, result, error) {
    this.status = status,
    this.result = result;
    this.error = error;
    this.date = new Date();
}

module.exports = response;