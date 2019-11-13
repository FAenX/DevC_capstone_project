const fs = require("fs");

const AWS = require("aws-sdk");
const Busboy = require("busboy");

const currentPath = process.cwd();
const fileName = fs.readFileSync(`${currentPath}/test/image.png`);
console.log(fileName.filename);


function uploadToS3(file) {
  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME,
  });
  s3bucket.createBucket(() => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: "name",
      Body: file,
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("error in callback");
        console.log(err);
      }
      console.log("success");
      console.log(data);
    });
  });
}


uploadToS3(fileName);
