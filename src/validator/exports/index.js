const ExportNotesPlayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportNotesPlayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.message);
    }
  },
};

module.exports = ExportValidator;
