

export function servSolve(payload: any) {
	return (payload && payload._isServResponse) ? payload : {
		_isServResponse: true,
		status: true,
		data: payload
	}
}

export function servReject(reason: any, detail?: string) {
	return (reason && reason._isServResponse) ? reason : {
		_isServResponse: true,
		status: false,
		data: reason,
		detail
	}
}
