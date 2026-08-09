const path = require("path");
const fs = require("fs");
const os = require("os");
const EventEmitter = require("events");
const zlib = require("zlib");

// 1 log current file path and directory
function logPath() {
  console.log({ File: __filename, Dir: __dirname });
}
logPath();

// 2 return file name from a path
function getFileName(filePath) {
  console.log(path.basename(filePath));
}
getFileName("/user/files/report.pdf");

// 3 build a path from an object
function buildPath(obj) {
  console.log(path.format(obj));
}
buildPath({ dir: "/folder", name: "app", ext: ".js" });

// 4 return file extension
function getExt(filePath) {
  console.log(path.extname(filePath));
}
getExt("/docs/readme.md");

// 5 parse path and return name + ext
function parsePath(filePath) {
  let parsed = path.parse(filePath);
  console.log({ Name: parsed.name, Ext: parsed.ext });
}
parsePath("/home/app/main.js");

// 6 check if path is absolute
function isAbsolute(filePath) {
  console.log(path.isAbsolute(filePath));
}
isAbsolute("/home/user/file.txt");

// 7 join multiple segments
function joinPaths(a, b, c) {
  console.log(path.join(a, b, c));
}
joinPaths("src", "components", "App.js");

// 8 resolve relative path to absolute
function resolvePath(filePath) {
  console.log(path.resolve(filePath));
}
resolvePath("./index.js");

// 9 join two paths
function joinTwo(p1, p2) {
  console.log(path.join(p1, p2));
}
joinTwo("/folder1", "folder2/file.txt");

// 10 delete a file asynchronously
function deleteFile(filePath) {
  fs.unlink(filePath, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log(`The ${path.basename(filePath)} is deleted.`);
  });
}
// deleteFile("./path/to/file.txt");

// 11 create a folder synchronously
function createFolder(folderPath) {
  fs.mkdirSync(folderPath);
  console.log("Success");
}
// createFolder("./newFolder");

// 12 event emitter listens for "start"
const emitter = new EventEmitter();
emitter.on("start", function () {
  console.log("Welcome event triggered!");
});
emitter.emit("start");

// 13 emit custom "login" event with username
emitter.on("login", function (username) {
  console.log("User logged in: " + username);
});
emitter.emit("login", "Ahmed");

// 14 read a file synchronously and log contents
function readFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  console.log(content);
}
// readFile("./notes.txt");

// 15 write asynchronously to a file
function writeFileAsync(filePath, content) {
  fs.writeFile(filePath, content, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log("File written successfully.");
  });
}
// writeFileAsync("./async.txt", "Async save");

// 16 check if a directory exists
function checkExists(filePath) {
  console.log(fs.existsSync(filePath));
}
// checkExists("./notes.txt");

// 17 return OS platform and CPU architecture
function getPlatform() {
  console.log({ Platform: os.platform(), Arch: os.arch() });
}
getPlatform();

// 18 read a file in chunks using a readable stream
function readInChunks(filePath) {
  let stream = fs.createReadStream(filePath, { encoding: "utf8" });
  stream.on("data", function (chunk) {
    console.log(chunk);
  });
}
// readInChunks("./big.txt");

// 19 copy content from one file to another using streams
function copyWithStreams(source, dest) {
  let readStream = fs.createReadStream(source);
  let writeStream = fs.createWriteStream(dest);
  readStream.pipe(writeStream);
  writeStream.on("finish", function () {
    console.log("File copied using streams");
  });
}
// copyWithStreams("./source.txt", "./dest.txt");

// 20 pipeline that reads, compresses, and writes a file
function compressFile(source, dest) {
  let readStream = fs.createReadStream(source);
  let gzip = zlib.createGzip();
  let writeStream = fs.createWriteStream(dest);

  require("stream").pipeline(readStream, gzip, writeStream, function (err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log("File compressed successfully.");
  });
}
// compressFile("./data.txt", "./data.txt.gz");
