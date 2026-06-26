export interface ShortenRequest {
    longUrl: string;
    clerkUserId?: string;
}

export interface ClickEvent {
    urlId: number;
    ipAddress: string;
    country?: string;
    userAgent?: string;
    referrer?: string;
}