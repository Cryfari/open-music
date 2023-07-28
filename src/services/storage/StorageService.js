const fs = require('fs');
/**
 * storage service
 */
class StorageService {
  /**
   * constructor
   * @param {string} folder
   */
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }
  }

  /**
   * @param {readable} file
   * @param {object} filename
   * @return {object}
   */
  writeFile(file, filename) {
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  /**
   * @param {string} file
   */
  deleteFile(file) {
    const path = `${this._folder}\\${file}`;
    fs.unlinkSync(path);
  }
}

module.exports = StorageService;
