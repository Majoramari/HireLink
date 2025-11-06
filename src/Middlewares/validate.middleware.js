export const validateBody = (schema) => {
  return (req, res, next) => {

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {

      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      
      });
    
    }

    next();
  };
};
