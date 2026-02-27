/**
 * Zod validation middleware.
 * Usage: router.post('/route', zodValidate(MySchema), controller)
 *
 * On validation failure → 400 with structured errors.
 * On success → req.body is replaced with the parsed (coerced) value.
 */
const zodValidate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    });
  }

  // Replace body with parsed data (whitelist unknown fields)
  req.body = result.data;
  next();
};

module.exports = zodValidate;
