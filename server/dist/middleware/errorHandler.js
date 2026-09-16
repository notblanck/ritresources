export function errorHandler(err, req, res, next) {
    console.error('API Error:', err);
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
}
