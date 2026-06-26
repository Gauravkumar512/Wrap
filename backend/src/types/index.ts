export interface ShortenRequest {
    longUrl: string;
    clerkUserId?: string;
}

export interface ClickEvent {
    urlId: number;
    slug: string;
    ipAddress: string;
    country?: string;
    userAgent?: string;
    referrer?: string;
}