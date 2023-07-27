const Joi = require('joi');

const ExportNotesPlayloadSchema = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});

module.exports = ExportNotesPlayloadSchema;
