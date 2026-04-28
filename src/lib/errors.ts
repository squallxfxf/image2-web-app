export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code = 'APP_ERROR'
  ) {
    super(message);
  }
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json({ error: error.message, code: error.code }, { status: error.status });
  }

  console.error('Unhandled API error', error);
  return Response.json({ error: '服务器内部错误', code: 'INTERNAL_ERROR' }, { status: 500 });
}
