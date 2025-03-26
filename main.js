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

    // Securely send email (replace with actual API for sending email)
    function sendFile(fileUrl, fileName, emails) {
        // Call backend API to send email securely
        console.log('Sending email to: ', emails);
        // Simulated successful email send
        alert(`Email sent to: ${emails.join(', ')}`);
    }

    // Store file info in database securely (replace with your database logic)
    function storeFileInfo(fileUrl, fileName, emails) {
        console.log('Storing file info in database');
        // Simulated successful database store
        alert('File info stored successfully');
    }
});
</script>

