import { useEffect, useState } from 'react';
import PendingRequests from './PendingRequests';
import TeacherManagement from './TeacherManagement';
import ClassManagement from './ClassManagement';
import StudentManagement from './StudentManagement';
import { authFetch } from '../utils/authFetch';

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'requests' | 'teachers' | 'classes' | 'students'>('home');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = async () => {
        try {
            await authFetch('/api/logout');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        }
    };

    if (!user) {
        return <div style={{ padding: '20px', color: '#000', backgroundColor: '#fff' }}>Đang tải...</div>;
    }

    return (
        <div className="app-container">
            <header className="flex-between glass-panel animate-fade-in" style={{ padding: '15px 30px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                        width: '40px', height: '40px', 
                        borderRadius: '10px', 
                        background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                        boxShadow: 'var(--shadow-glow)'
                    }}>A</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Admin Portal</h1>
                </div>
                <nav style={{ display: 'flex', gap: '10px' }}>
                    <button className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('home')}>Trang chủ</button>
                    <button className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('requests')}>Yêu cầu</button>
                    <button className={`btn ${activeTab === 'teachers' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('teachers')}>Giảng viên</button>
                    <button className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('classes')}>Lớp học</button>
                    <button className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('students')}>Sinh viên</button>
                </nav>
                <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto' }}>Đăng xuất</button>
            </header>

            <main className="animate-slide-up">
                {activeTab === 'home' && (
                    <div className="glass-card">
                        <h3 className="section-title">Chào mừng Admin, <span style={{ color: 'var(--primary-color)' }}>{user.fullName}</span>!</h3>
                        
                        <div className="grid-cards mt-4">
                            <div className="glass-panel" style={{ padding: '20px' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Địa chỉ Email</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user.email}</div>
                            </div>
                            
                            <div className="glass-panel" style={{ padding: '20px' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Vai trò truy cập</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                                    <span className="badge badge-primary">
                                        {user.roles?.map((r:any) => r.name).join(', ')}
                                    </span>
                                </div>
                            </div>
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

export default Dashboard;
