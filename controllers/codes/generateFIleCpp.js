const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const generateFileCpp = async (content) => {
  const jobId = uuid();
  const folderName = path.join(__dirname, `${jobId}`);
  fs.mkdirSync(folderName, { recursive: true });
  const filename = `main.cpp`;
  const filepath = path.join(folderName,filename);
  fs.writeFileSync(filepath, content);
  return folderName;
};

module.exports = {
  generateFileCpp,
};