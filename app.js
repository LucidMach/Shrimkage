#!/usr/bin/env node
const yargs = require("yargs");
const imagemin = require("imagemin");
const imageminJPEG = require("imagemin-mozjpeg");
const imageminPNG = require("imagemin-pngquant");
const slash = require("slash");
const fs = require("fs");
const path = require("path");

// extracting the main command from {_:["command"],$0:"shrimkage",param1:"value",param2:"value"}
const command = process.argv[2];
const options = yargs.argv;

// async image shrinking with minimage.js
const shrimkage = async (inPath, quality, outPath) => {
  try {
    // OG File Size
    options.path
      ? console.log(`Input File Size: ${fs.statSync(inPath).size}`)
      : null;

    // Compression
    const file = await imagemin([inPath], {
      destination: outPath,
      plugins: [
        imageminJPEG({ quality }),
        imageminPNG({ quality: [quality / 100, quality / 100] }),
      ],
    });

    // New File Size
    options.path
      ? console.log(
          `Output File Size: ${fs.statSync(outPath + "/" + options.path).size}`
        )
      : console.log("COMPRESSED");
  } catch (error) {
    console.log(error);
  }
};

// @TODO: file --path="./hi.png" --level="10"
if (command === "file") {
  // checking for path
  if (!options.path) return console.log("path to file unspecified!!");

  inPath = slash(path.join(process.cwd(), options.path));
  quality = options.level ? options.level : 50;
  outPath = slash(path.join(process.cwd(), "compressed"));

  shrimkage(inPath, quality, outPath);
}

// @TODO: folder --level="90"
if (command === "folder") {
  // getting list of all files in dir
  fs.readdirSync(process.cwd()).forEach((file) => {
    // checking if a file is an png/jpg
    if (file.split(".")[1] === "png" || file.split(".")[1] === "jpg");
    {
      inPath = slash(path.join(process.cwd(), file));
      quality = options.level ? options.level : 50;
      outPath = slash(path.join(process.cwd(), "compressed"));

      shrimkage(inPath, quality, outPath);
    }
  });
}

// for dev purposes
if (command === "path") {
  console.log(process.cwd());
}

// --help contents
yargs
  .usage(
    "Commands At Disposal: \n 1. $0 folder --level=10 \n 🤔 compresses all images in folder to 10/100 of size [without resolution loss] \n\n 2. $0 file --path=./image.png [required] --level=20 \n 🤔 compresses specified image to 20/100 of size [without resolution loss] \n NOTE: default value for level is 10"
  )
  .help("h")
  .alias("h", "help").argv;
