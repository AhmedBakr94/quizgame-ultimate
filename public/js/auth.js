// تسجيل الدخول
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const phoneNumber = document.getElementById('phone').value;
    
    // رقم المدير الخاص
    if(phoneNumber === '01227106091') {
        window.location.href = '/admin.html';
        return;
    }

    // تسجيل الدخول للمستخدم العادي
    firebase.auth().signInAnonymously()
        .then(() => {
            const user = firebase.auth().currentUser;
            if(user) {
                // حفظ بيانات المستخدم
                database.ref('users/' + user.uid).set({
                    phone: phoneNumber,
                    points: 0,
                    lastLogin: new Date().toISOString()
                });
                window.location.href = '/index.html';
            }
        })
        .catch((error) => {
            console.error('Error signing in:', error);
            alert('حدث خطأ أثناء تسجيل الدخول');
        });
});

// تسجيل الخروج
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = '/login.html';
        });
});

// متابعة حالة المصادقة
firebase.auth().onAuthStateChanged((user) => {
    if(user && window.location.pathname === '/login.html') {
        window.location.href = '/index.html';
    }
    else if(!user && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
    }
    
    if(user) {
        // تحديث معلومات المستخدم
        database.ref('users/' + user.uid).on('value', (snapshot) => {
            const userData = snapshot.val();
            if(userData) {
                document.getElementById('userInfo')?.textContent = userData.phone;
                document.getElementById('userPoints')?.textContent = userData.points + ' نقطة';
            }
        });
    }
});
