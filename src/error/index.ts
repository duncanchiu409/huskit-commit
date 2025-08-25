class ProviderNotSetError extends Error {
  constructor() {
    super("huskit-commit provider is not set");
  }
}

class ModelNotSetError extends Error {
  constructor(model: string) {
    super(`${model} model is not set`);
  }
}

class ApiKeyNotSetError extends Error {
  constructor(model: string) {
    super(`${model} api key is not set`);
  }
}

class ApiUrlNotSetError extends Error {
  constructor(model: string) {
    super(`${model} api url is not set`);
  }
}

class ModelNotAvailableError extends Error {
  constructor(model: string) {
    super(`${model} model is not available`);
  }
}

class OllamaCopyError extends Error {
  constructor(source: string, destination: string) {
    super(`Failed to copy the ollama model: ${source} to ${destination}`);
  }
}

class UnknownError extends Error {
  constructor(error: unknown) {
    super(`Unknown error: ${error}`);
  }
}

export default {
  ProviderNotSetError,
  ModelNotSetError,
  ApiKeyNotSetError,
  ApiUrlNotSetError,
  ModelNotAvailableError,
  OllamaCopyError,
  UnknownError,
};
