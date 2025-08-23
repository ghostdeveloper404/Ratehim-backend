const bodyValidator = (schema) => {
  return (req, res, next) => {
      const { error } = schema.validate(req.body, { abortEarly: true });
      const valid = error == null;

      if (valid) {
          next();
    
      } else {
          const { details } = error;
          const message = details.map(e => (e.message).replace("/",'')).join(',') ;
          return res.status(422).json({ message: message});
      }
  }
}



const queryValidator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query, { abortEarly: true });
        const valid = error == null;
  
        if (valid) {
            next();
      
        } else {
            const { details } = error;
            const message = details.map(e => (e.message).replace("/",'')).join(',') ;
            return res.status(422).json({ message: message});
        }
    }
  }
const paramValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: true });
    if (!error) return next();

    const message = error.details.map(e => e.message).join(', ');
    return res.status(422).json({ message });
  };
};

module.exports = { bodyValidator, queryValidator, paramValidator };