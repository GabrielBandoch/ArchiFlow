export class UrlBuilder {
  private segments: string[] = [];
  private queryParams: { [key: string]: string } = {};

  constructor(private baseUrl: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl.replace(/\/$/, '');
    }
  }

  segment(path: string | number): UrlBuilder {
    if (path !== undefined && path !== null && path !== '') {
      const sanitized = path.toString().replace(/^\/|\/$/g, '');
      if (sanitized) {
        this.segments.push(sanitized);
      }
    }
    return this;
  }

  queryParam(key: string, value: any): UrlBuilder {
    if (value !== undefined && value !== null && value !== '') {
      this.queryParams[key] = value.toString();
    }
    return this;
  }

  build(): string {
    let url = this.baseUrl;
    
    if (this.segments.length > 0) {
      url += '/' + this.segments.join('/');
    }

    const queryKeys = Object.keys(this.queryParams);
    if (queryKeys.length > 0) {
      const queryString = queryKeys
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(this.queryParams[key])}`)
        .join('&');
      url += '?' + queryString;
    }

    return url;
  }
}
