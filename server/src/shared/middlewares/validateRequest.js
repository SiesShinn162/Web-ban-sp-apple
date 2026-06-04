
export function validateRequestBody(requiredFields) {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (field.includes('.')) {

        const [parent, child] = field.split('.');
        if (!req.body[parent] || req.body[parent][child] === undefined || req.body[parent][child] === '') {
          missingFields.push(field);
        }
      } else {
        if (req.body[field] === undefined || req.body[field] === '') {
          missingFields.push(field);
        }
      }
    }

    if (missingFields.length > 0) {
      res.status(400);
      return next(new Error(`Vui lòng cung cấp đầy đủ thông tin các trường: ${missingFields.join(', ')}`));
    }

    next();
  };
}
