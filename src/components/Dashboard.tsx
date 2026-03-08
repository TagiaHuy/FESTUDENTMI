import { useEffect, useState } from 'react';
import PendingRequests from './PendingRequests';
import TeacherManagement from './TeacherManagement';
import ClassManagement from './ClassManagement';
import StudentManagement from './StudentManagement';

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'requests' | 'teachers' | 'classes' | 'students'>('home');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    if (!user) {
        return <div style={{ padding: '20px', color: '#000', backgroundColor: '#fff' }}>Đang tải...</div>;
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Hệ thống Quản lý Sinh viên</h1>
                <nav style={styles.nav}>
                    <button style={activeTab === 'home' ? styles.activeBtn : styles.navBtn} onClick={() => setActiveTab('home')}>Trang chủ</button>
                    <button style={activeTab === 'requests' ? styles.activeBtn : styles.navBtn} onClick={() => setActiveTab('requests')}>Yêu cầu cấp quyền</button>
                    <button style={activeTab === 'teachers' ? styles.activeBtn : styles.navBtn} onClick={() => setActiveTab('teachers')}>Quản lý Giảng viên</button>
                    <button style={activeTab === 'classes' ? styles.activeBtn : styles.navBtn} onClick={() => setActiveTab('classes')}>Quản lý Lớp học</button>
                    <button style={activeTab === 'students' ? styles.activeBtn : styles.navBtn} onClick={() => setActiveTab('students')}>Quản lý Sinh viên</button>
                </nav>
                <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
            </header>

            <main style={styles.main}>
                {activeTab === 'home' && (
                    <div style={styles.card}>
                        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Chào mừng Admin, {user.fullName}!</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Quyền hạn:</strong> {user.roles?.map((r:any) => r.name).join(', ')}</p>
                        <div style={styles.warningBox}>
                            <h4>🚨 Cảnh báo bảo mật:</h4>
                            <p>Mật khẩu của bạn đang bị lộ: <code>{user.password}</code></p>
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && <PendingRequests />}
                {activeTab === 'teachers' && <TeacherManagement />}
                {activeTab === 'classes' && <ClassManagement />}
                {activeTab === 'students' && <StudentManagement />}
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#ffffff', color: '#000000', borderBottom: '2px solid #eeeeee' },
    nav: { display: 'flex', gap: '10px' },
    navBtn: { backgroundColor: '#f8f9fa', color: '#000', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
    activeBtn: { backgroundColor: '#000', color: '#fff', border: '1px solid #000', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
    logoutBtn: { backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    main: { padding: '30px 40px' },
    card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #dddddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    warningBox: { border: '1px solid #ff0000', padding: '10px', marginTop: '10px', backgroundColor: '#fff5f5' }
};

export default Dashboard;
