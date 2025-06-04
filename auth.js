document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            users.push({ name, email, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful! Please login.");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                alert("Login successful!");
                window.location.href = "index.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }

    // Check auth state changes
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            localStorage.setItem('loggedInUser', JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            }));
        } else {
            // User is signed out
            console.log('User is signed out');
            localStorage.removeItem('loggedInUser');
        }
    });

    // Handle Sign Out
    function signOut() {
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Logout gagal: ' + error.message);
            });
    }
});

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyBu2QKF2kZ0qe6Ue6iK8u2LZ6AV3Qf7KkQ",
    authDomain: "konser-id.firebaseapp.com",
    projectId: "konser-id",
    storageBucket: "konser-id",
    messagingSenderId: "567890123456",
    appId: "1:567890123456:web:abc123def456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Handle Google Sign In
function googleSignIn() {
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // Save user data to localStorage
            localStorage.setItem('loggedInUser', JSON.stringify({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL
            }));
            // Redirect to home page after successful login
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login gagal: ' + error.message);
        });
}
