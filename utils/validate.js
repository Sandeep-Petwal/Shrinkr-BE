// Utility: Handle Validation Errors
const validateRequest = (schema, req) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return {
            success: false,
            message: error.details[0].message.replace(/\"/g, ''),
        };
    }
    return { success: true, value };
};

module.exports = validateRequest;
