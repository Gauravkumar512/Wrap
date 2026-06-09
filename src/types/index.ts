export interface ShortenRequest {
    longUrl: string;
    userId?: number;
}

export interface ClickEvent {
    urlId: number;
    ipAddress: string;
    country?: string;
    userAgent?: string;
    referrer?: string;
}