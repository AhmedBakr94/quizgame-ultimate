document.addEventListener('DOMContentLoaded', function() {
    const user = firebase.auth().currentUser;
    if(user) {
        database.ref('users/' + user.uid).on('value', (snapshot) => {
            const userData = snapshot.val();
            document.getElementById('withdrawPoints').textContent = userData.points + ' نقطة';
            
            // حساب الهدف الحالي للسحب
            const currentTarget = Math.ceil((userData.lastWithdrawTarget || 3000) / 3000) * 3000;
            document.getElementById('targetAmount').textContent = 
                `${currentTarget} نقطة (${currentTarget / 100} جنيهاً)`;
                
            // تفعيل/تعطيل زر السحب
            const withdrawBtn = document.getElementById('withdrawBtn');
            withdrawBtn.disabled = userData.points < currentTarget;
        });
    }

    document.getElementById('withdrawForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = firebase.auth().currentUser;
        if(user) {
            const phone = document.getElementById('withdrawPhone').value;
            const method = document.querySelector('input[name="method"]:checked').value;
            
            database.ref('users/' + user.uid).once('value').then((snapshot) => {
                const userData = snapshot.val();
                const currentTarget = Math.ceil((userData.lastWithdrawTarget || 3000) / 3000) * 3000;
                
                if(userData.points >= currentTarget) {
                    // إضافة طلب السحب
                    database.ref('withdrawRequests').push().set({
                        userId: user.uid,
                        phone: phone,
                        method: method,
                        amount: currentTarget / 100,
                        status: 'pending',
                        timestamp: new Date().toISOString()
                    });
                    
                    // تحديث نقاط المستخدم
                    database.ref('users/' + user.uid).update({
                        points: firebase.database.ServerValue.increment(-currentTarget),
                        lastWithdrawTarget: currentTarget + 3000
                    });
                    
                    alert('تم تقديم طلب السحب بنجاح! سيتم المراجعة من قبل الإدارة');
                    window.location.href = '/index.html';
                }
            });
        }
    });
});
