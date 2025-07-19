document.addEventListener('DOMContentLoaded', function() {
    // تحقق من صلاحيات المدير
    const user = firebase.auth().currentUser;
    if(!user || user.phoneNumber !== '+201227106091') {
        window.location.href = '/login.html';
    }

    // تسجيل خروج المدير
    document.getElementById('adminLogout').addEventListener('click', function() {
        firebase.auth().signOut();
    });

    // إدارة العروض الترويجية
    database.ref('offers').on('value', (snapshot) => {
        document.getElementById('offerText').value = snapshot.val() || '';
    });

    document.getElementById('offerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        database.ref('offers').set(document.getElementById('offerText').value)
            .then(() => alert('تم حفظ العرض بنجاح'));
    });

    // إضافة نقاط للمستخدمين
    document.getElementById('addPointsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = document.getElementById('userPhone').value;
        const points = parseInt(document.getElementById('pointsAmount').value);

        database.ref('users').orderByChild('phone').equalTo(phone).once('value')
            .then((snapshot) => {
                const userData = snapshot.val();
                if(userData) {
                    const userId = Object.keys(userData)[0];
                    database.ref('users/' + userId).update({
                        points: firebase.database.ServerValue.increment(points)
                    });
                    alert(`تم إضافة ${points} نقطة للمستخدم`);
                } else {
                    alert('لا يوجد مستخدم بهذا الرقم');
                }
            });
    });

    // عرض طلبات السحب
    database.ref('withdrawRequests').orderByChild('status').equalTo('pending').on('value', (snapshot) => {
        const requestsContainer = document.getElementById('withdrawRequests');
        requestsContainer.innerHTML = '';

        snapshot.forEach((childSnapshot) => {
            const request = childSnapshot.val();
            const requestElement = document.createElement('div');
            requestElement.className = 'request-card';
            requestElement.innerHTML = `
                <p>رقم الهاتف: ${request.phone}</p>
                <p>المبلغ: ${request.amount} جنيهاً</p>
                <p>الطريقة: ${request.method}</p>
                <div class="request-actions">
                    <button class="btn-approve" data-id="${childSnapshot.key}">موافقة</button>
                    <button class="btn-reject" data-id="${childSnapshot.key}">رفض</button>
                </div>
            `;
            requestsContainer.appendChild(requestElement);
        });

        // معالجة طلبات السحب
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                database.ref('withdrawRequests/' + requestId).update({
                    status: 'approved',
                    processedAt: new Date().toISOString()
                });
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                database.ref('withdrawRequests/' + requestId).update({
                    status: 'rejected',
                    processedAt: new Date().toISOString()
                });
            });
        });
    });
});
