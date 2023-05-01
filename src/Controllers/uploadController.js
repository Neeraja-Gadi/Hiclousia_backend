
function uploadFiles() {
    const resumeFile = userProfile.getElementById('resume').files[0];
    const documentFile = userProfile.getElementById('document').files[0];
    const profileLink = userProfile.getElementById('profileLink').images[0];
  
    const resumeParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: 'resume_' + Date.now() + '_' + resumeFile.name,
      Body: resumeFile    
    };
  
    const documentParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: 'document_' + Date.now() + '_' + documentFile.name,
      Body: documentFile
    };
  
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region:process.env.AWS_BUCKET_REGION
    });
  
    s3.upload(resumeParams, (err, data) => {
      if (err) {
        console.log('Error uploading resume:', err);
      } else {
        const resume = data.Location;
        console.log('Resume uploaded successfully:', resume);
        updateUserProfile('resume', resume);
      }
    });
  
    s3.upload(documentParams, (err, data) => {
      if (err) {
        console.log('Error uploading document:', err);
      } else {
        const document = data.Location;
        console.log('Document uploaded successfully:', document);
        updateUserProfile('document', document);
      }
    });
  
    updateUserProfile('profileLink', profileLink);
  }

  function updateUserProfile(fieldName, fieldValue) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', '/api/userprofile', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        console.log('User profile updated successfully:', fieldName, fieldValue);
      }
    };
    xhr.send(JSON.stringify({
      fieldName: fieldName,
      fieldValue: fieldValue
    }));
  }
module.exports ={uploadFiles};