// يمكنك وضع إعدادات Firebase الإضافية هنا
// أو أي دوال مساعدة متعلقة بـ Firebase

function getUserRef(uid) {
    return database.ref('users/' + uid);
}

function getQuestionsRef() {
    return database.ref('questions');
}

function getWithdrawRequestsRef() {
    return database.ref('withdrawRequests');
}

// تصدير الدوال للاستخدام في ملفات أخرى
export { getUserRef, getQuestionsRef, getWithdrawRequestsRef };
