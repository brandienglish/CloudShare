document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const fileForm = document.getElementById('fileForm');
    const fileShare = document.getElementById('fileShare');
    const login = document.getElementById('login');
    const fileList = document.getElementById('fileList');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        if (username === 'BLANK' && password === 'BLANK') {
            login.style.display = 'none';
            fileShare.style.display = 'block';
        } else {
            alert('Login failed');
        }
    });

    fileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const file = fileForm.file.files[0];
        const emails = [];
        for (let i = 1; i <= 5; i++) {
            const emailInput = document.getElementById(`email${i}`);
            if (emailInput && emailInput.value) {
                emails.push(emailInput.value);
            }
        }
        if (emails.length === 0) {
            alert('Please enter at least one email address');
            return;
        }
        if (file) {
            const fileItem = document.createElement('div');
            fileItem.textContent = file.name;
            fileList.appendChild(fileItem);
            alert(`File "${file.name}" will be sent to: ${emails.join(', ')}`);
            uploadFileToS3(file, emails);
        } else {
            alert('No file selected');
        }
    });

    function uploadFileToS3(file, emails) {
        AWS.config.update({
            accessKeyId: 'BLANK',
            secretAccessKey: 'BLANK',
            region: 'BLANK'
        });
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'BLANK',
            Key: file.name,
            Body: file,
            ACL: 'BLANK'
        };
        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading file:', err);
                alert('There was an error uploading your file. Please try again.');
            } else {
                console.log('Successfully uploaded file:', data);
                alert('File uploaded successfully.');
                sendFile(data.Location, file.name, emails);
                storeFileInfo(data.Location, file.name, emails);
            }
        });
    }

    function storeFileInfo(fileUrl, fileName, emails) {
        const dynamoDB = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'BLANK',
            Item: {
                ID: fileName,
                FileName: fileName,
                FileURL: fileUrl,
                Emails: emails,
                UploadedAt: new Date().toISOString()
            }
        };
        dynamoDB.put(params, (err, data) => {
            if (err) {
                console.error('Error storing file info:', err);
                alert('There was an error storing file information. Please try again.');
            } else {
                console.log('File info stored successfully:', data);
                alert('File Stored Successfully');
            }
        });
    }

    function sendFile(fileUrl, fileName, emails) {
        const ses = new AWS.SES();
        const params = {
            Source: 'BLANK',
            Destination: {
                ToAddresses: emails
            },
            Message: {
                Subject: {
                    Data: 'A file sent with AWS services has been shared with you'
                },
                Body: {
                    Text: {
                        Data: `A file has been shared with you! Please click the link to view the file: ${fileUrl}`
                    }
                }
            }
        };
        ses.sendEmail(params, (err, data) => {
            if (err) {
                console.error('Error sending email:', err);
                alert('Nope, didn’t send');
            } else {
                console.log('Email sent successfully:', data);
                alert('Email sent');
            }
        });
    }
})
