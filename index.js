const FS = require("fs");
var {format} = require("util");
require('dotenv').config();
const dir = process.cwd() + "/frontend/server/Logs";
const logfileLimit = process.env.LOG_FILE_LIMIT;
let currentDate = new Date();
let idDate = currentDate
.toLocaleDateString("en-GB")
.replaceAll("/", "-");

let idTime = "T" + currentDate.getHours() + "-" + currentDate.getMinutes();
idDate += idTime;

var log_file = FS.createWriteStream(dir + "/" + idDate + ".log", {
  flags: "w",});
  var log_stdout = process.stdout;
  console.log("Environment set to: " + process.env.SYSTEM_ENV);

systemEmitter.on("getLatestLog", () => systemEmitter.emit("sendLatestLog", FS.readFileSync(dir + "/" + idDate + ".log", 'utf8')));

process.on("uncaughtException", async (err, origin) => {
  console.error("Caught exception: " + err.stack);
  log_file.end((err) => process.exit(0));
  process.exitCode = 0;
});

process.on("caughtException", async function(err){
  console.error("Caught exception." + err);
  log_file.write("[ERROR]" + date.toLocaleString("en-GB") + ": \t" + format(logString, data, moreData) + "\n");
  log_file.end((err) => process.exit(0));
  process.exitCode = 0;
});

console.warn = function (logString, data = "", moreData = "") {
  let date = new Date();
  log_file.write("[WARNING]" + date.toLocaleString("en-GB") + ": \t" + format(logString, data, moreData) + "\n");
  if(process.env.SYSTEM_ENV === 'production') return;
  log_stdout.write(format(logString, data, moreData) + "\n");
}

console.error = function (logString, data = "", moreData = "") {
  let date = new Date();
  log_file.write("[ERROR]" + date.toLocaleString("en-GB") + ": \t" + format(logString, data, moreData) + "\n");
  log_stdout.write(format(logString, data, moreData) + "\n");
}

console.log = function (logString, data = "", moreData = "") {
  let date = new Date();
  log_file.write("[LOG]" + date.toLocaleString("en-GB") + ": \t" + format(logString, data, moreData) + "\n");
  if(process.env.SYSTEM_ENV === 'production') return;
  log_stdout.write(format(logString, data, moreData) + "\n");
};

console.debug = function (logString, data = "", moreData = "") {
  let date = new Date();
  log_file.write("[DEBUG]" + date.toLocaleString("en-GB") + ": \t" + format(logString, data, moreData) + "\n");
  if(process.env.SYSTEM_ENV === 'production') return;
  log_stdout.write(format(logString, data, moreData) + "\n");
}

let fileCount = getLogfileCount();
if (fileCount > logfileLimit) {
  cleanLogfiles(fileCount);
}

function getLogfileCount() {
  let filesCount = 0;
  try {
    const files = FS.readdirSync(dir);
    filesCount = files.length;
  } catch (error) {
    console.log(error);
  }
  return filesCount;
}

function cleanLogfiles(numberOfFiles) {
  const files = FS.readdirSync(dir);
  files.sort((a, b) => {
    let aStat = FS.statSync(`${dir}/${a}`),
        bStat = FS.statSync(`${dir}/${b}`);
    
    return new Date(bStat.birthtime).getTime() - new Date(aStat.birthtime).getTime();
  });
  files.reverse();

  for (const file of files) {
    FS.unlinkSync(dir + "/" + file);
    numberOfFiles--;
    if (numberOfFiles < logfileLimit) break;
  }
}
