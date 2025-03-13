const success = (res, data = null, statusCode = 200, message = "Request Success.") => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data && { data })
    });
};

const failled = (res, statusCode = 400, message = "Request Failled.", data = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(data && { data })
    });
};

module.exports = { success, failled };
