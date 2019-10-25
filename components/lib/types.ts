export interface IOptions {
	getToken: () => string;
}

export interface ICookieHeader extends Headers {
	cookie: string;
}

export interface IRequestWithCookie extends Request {
	headers: ICookieHeader;
}
