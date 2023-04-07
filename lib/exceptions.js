class NotFoundException extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 404
  }
}

class RequestException extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode || 417
  }
}

module.exports = {
  NotFoundException,
  RequestException
}