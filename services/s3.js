var AWS = require('aws-sdk');
AWS.config.update({
    "accessKeyId": "AKIAUX7BYM6ZZALNQ2HD",
    "secretAccessKey": "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",
    "region": "ap-south-1"  
});
var s3Bucket = new AWS.S3( { params: {Bucket: "freedom-documents"} } );

function fileUploadViaBase64(file_path,base64string,contentType)
{
    buf = Buffer.from(base64string.replace(/^data:image\/\w+;base64,/, ""),'base64')
    var data = {
        Key: file_path, 
        Body: buf,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: contentType
    };
    s3Bucket.putObject(data, function(err, data){
        if (err) { 
            return false;
        } else {
            return true;
        }
    });
}

async function deleteKey(file_path)
{
    var params = {  Bucket: 'pawspace', Key: file_path };
    s3Bucket.deleteObject(params, function(err, data) {
    if (err) 
        return err  
    else 
        return data      
    });
}

async function fileUploadViaMultipart(file_path,content,contentType)
{
    var data = {
        Key: file_path, 
        Body: content,
        ACL: 'public-read',
        ContentType: contentType
    };
    let get = await s3Bucket.putObject(data).promise();
    return get;
}

function deleteFolder(file_path,callback){
    var params = {
      Bucket: "freedom-documents",
      Prefix: file_path
    };
  
    s3Bucket.listObjects(params, function(err, data) {
      if (err) return callback(err);
  
      if (data.Contents.length == 0);
  
      params = {Bucket: "freedom-documents"};
      params.Delete = {Objects:[]};
      
      data.Contents.forEach(function(content) {
        params.Delete.Objects.push({Key: content.Key});
      });
  
      s3Bucket.deleteObjects(params, function(err, data) {
        if (err) return err;
        if (data.IsTruncated) {
            deleteFolder("freedom-documents");
        } else {
          callback();
        }
      });
    });
}

module.exports = 
{
    fileUploadViaBase64,
    deleteKey,
    fileUploadViaMultipart,
    deleteFolder
}