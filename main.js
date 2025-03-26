<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome To ShareCloud</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://sdk.amazonaws.com/js/aws-sdk-2.999.0.min.js"></script>
    <script src="main.js"></script>
</head>
<body>
    <div class="container">
        <div id="login">
            <h2>Welcome to ShareCloud</h2>
            <form id="loginForm">
                <label for="username">Username:</label>
                <input type="text" id="username" name="user" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Login</button>
            </form>
        </div>
        
        <div id="fileShare" style="display: none;">
            <h2>Share File</h2>
            <form id="fileForm">
                <input type="file" id="file" name="file" required>
                <div id="emailSection">
                    <label for="email1">Email 1:</label>
                    <input type="email" id="email1" name="email" required>
                    <label for="email2">Email 2:</label>
                    <input type="email" id="email2" name="email">
                    <label for="email3">Email 3:</label>
                    <input type="email" id="email3" name="email">
                    <label for="email4">Email 4:</label>
                    <input type="email" id="email4" name="email">
                    <label for="email5">Email 5:</label>
                    <input type="email" id="email5" name="email">
                </div>
                <button type="submit">Upload</button>
            </form>
            <div id="fileList"></div>
        </div>
    </div>
</body>
</html>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const fileForm = document.getElementById('fileForm');
    const fileShare = document.getElementById('fileShare');
    const login = document.getElementById('login');
    const fileList = document.getElementById('fileList');

    // Secure login with server-side authentication
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Assume server-side API call to verify login credentials (this is a mock)
        authenticateUser(username, password).then(isAuthenticated => {
            if (isAuthenticated) {
                login.style.display = 'none';
                fileShare.style.display = 'block';
            } else {
                alert('Login failed');
            }
        });
    });

    // Handle file upload securely
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

        // Restrict file types and sizes
        if (file && validateFile(file)) {
            const fileItem = document.createElement('div');
            fileItem.textContent = file.name;
            fileList.appendChild(fileItem);
            alert(`File "${file.name}" will be sent to: ${emails.join(', ')}`);
            
            // Send file to server to get signed URL for S3 upload
            getSignedUrlForFile(file).then(signedUrl => {
                uploadFileToS3(file, signedUrl);
                sendFile(signedUrl, file.name, emails);
                storeFileInfo(signedUrl, file.name, emails);
            });
        } else {
            alert('No file selected or invalid file type/size');
        }
    });

    // Validate file type and size
    function validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB max size
        
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type');
            return false;
        }

        if (file.size > maxSize) {
            alert('File is too large. Max size is 10MB');
            return false;
        }

        return true;
    }

    // Mock function to simulate server-side user authentication
    function authenticateUser(username, password) {
        return new Promise(resolve => {
            // Replace with your actual authentication logic
            if (username === 'validUser' && password === 'validPassword') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    // Get a signed URL from your backend (replace with actual API call)
    function getSignedUrlForFile(file) {
        return new Promise(resolve => {
            // Replace with your API to generate a signed URL
            resolve('https://your-signed-url-to-upload-file.com');
        });
    }

    // Securely upload file to S3 using a signed URL
    function uploadFileToS3(file, signedUrl) {
        fetch(signedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type
            },
            body: file
        })
        .then(response => {
            if (response.ok) {
                alert('File uploaded successfully.');
            } else {
                alert('There was an error uploading your file. Please try again.');
            }
        })
        .catch(err => {
            console.error('Error uploading file:', err);
            alert('There was an error uploading your file. Please try again.');
        });
    }

     
    function sendFile(fileUrl, fileName, emails) {
         
        console.log('Sending email to: ', emails);
        // Simulated successful email send
        alert(`Email sent to: ${emails.join(', ')}`);
    }

   
    function storeFileInfo(fileUrl, fileName, emails) {
        console.log('Storing file info in database');
        // Simulated successful database store
        alert('File info stored successfully');
    }
});
</script>

