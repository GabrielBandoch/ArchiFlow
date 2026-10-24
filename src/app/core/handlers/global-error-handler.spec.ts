import { GlobalErrorHandler } from "./global-error-handler";

describe("GlobalErrorHandler", () => {
  let handler: GlobalErrorHandler;

  beforeEach(() => {
    handler = new GlobalErrorHandler();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("should be created", () => {
    expect(handler).toBeTruthy();
  });

  it("should log regular errors to console.error", () => {
    spyOn(console, "error");
    const regularError = new Error("Test standard error");

    handler.handleError(regularError);

    expect(console.error).toHaveBeenCalledWith(regularError);
  });

  it("should attempt reload on chunk load failure", () => {
    spyOn(handler, "reloadPage");

    const chunkError = new TypeError(
      "Failed to fetch dynamically imported module: https://staging.cotu.com.br/chunk-Z5XZBHGD.js",
    );
    handler.handleError(chunkError);

    expect(handler.reloadPage).toHaveBeenCalled();
    expect(sessionStorage.getItem("archiflow_chunk_reload_count")).toBe("1");
  });

  it("should not reload repeatedly after 1 attempt within debounce window", () => {
    sessionStorage.setItem("archiflow_chunk_reload_ts", String(Date.now()));
    sessionStorage.setItem("archiflow_chunk_reload_count", "1");
    spyOn(handler, "reloadPage");
    spyOn(console, "error");

    const chunkError = new TypeError(
      "Failed to fetch dynamically imported module: https://staging.cotu.com.br/chunk-Z5XZBHGD.js",
    );
    handler.handleError(chunkError);

    expect(handler.reloadPage).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(chunkError);
  });

  it("should handle chunk error wrapped in promise rejection object", () => {
    spyOn(handler, "reloadPage");

    const rejectionWrapper = {
      rejection: new Error(
        "Failed to load module script: https://staging.cotu.com.br/chunk-abc.js",
      ),
    };

    handler.handleError(rejectionWrapper);

    expect(handler.reloadPage).toHaveBeenCalled();
  });

  it("should not throw when sessionStorage access throws exception", () => {
    spyOn(sessionStorage, "getItem").and.throwError(
      new DOMException("Storage access denied", "SecurityError"),
    );
    spyOn(handler, "reloadPage");

    const chunkError = new Error("Loading chunk 123 failed");

    expect(() => handler.handleError(chunkError)).not.toThrow();
    expect(handler.reloadPage).toHaveBeenCalled();
  });
});
