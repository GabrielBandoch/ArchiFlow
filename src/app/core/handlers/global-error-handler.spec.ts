import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;

  beforeEach(() => {
    handler = new GlobalErrorHandler();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('should log regular errors to console.error', () => {
    spyOn(console, 'error');
    const regularError = new Error('Test standard error');

    handler.handleError(regularError);

    expect(console.error).toHaveBeenCalledWith(regularError);
  });

  it('should attempt reload on chunk load failure', () => {
    spyOn(handler, 'reloadPage');

    const chunkError = new TypeError('Failed to fetch dynamically imported module: https://staging.cotu.com.br/chunk-Z5XZBHGD.js');
    handler.handleError(chunkError);

    expect(handler.reloadPage).toHaveBeenCalled();
    expect(sessionStorage.getItem('archiflow_chunk_reload')).toBeTruthy();
  });

  it('should not reload repeatedly within 15 seconds', () => {
    sessionStorage.setItem('archiflow_chunk_reload', String(Date.now()));
    spyOn(handler, 'reloadPage');
    spyOn(console, 'error');

    const chunkError = new TypeError('Failed to fetch dynamically imported module: https://staging.cotu.com.br/chunk-Z5XZBHGD.js');
    handler.handleError(chunkError);

    expect(handler.reloadPage).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(chunkError);
  });
});
