

export function servSolve(payload: any, detail?: any) {
	return (payload && payload._isServResponse) ? payload : {
		_isServResponse: true,
		status: true,
		data: payload,
		detail
	}
}

export function servReject(reason: any, detail?: any) {
	return (reason && reason._isServResponse) ? reason : {
		_isServResponse: true,
		status: false,
		data: reason,
		detail
	}
}
