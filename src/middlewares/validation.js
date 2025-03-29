import { validationResult } from "express-validator";

export const validateInput = function (req, res, next) {
  const errors = validationResult(req); // validation result
  if (!errors.isEmpty()) {
    // if there are errors
    return res.status(422).json({ msg: errors.array() }); // response with errors, then return; to stop the route from executing the next handler
  }
  next(); // if no errors, call the next handler
};
