"use strict";

class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AppError";
    this.code = code ?? "APP_ERROR";
  }
}

module.exports = { AppError };

