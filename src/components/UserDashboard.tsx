import { useEffect, useState } from 'react';

const UserDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [requestReason, setRequestReason] = useState('');
    const [requestMessage, setRequestMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch('/api/classes');
            const data = await res.json();
            setClasses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setRequestMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/students/request-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    reason: requestReason
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setRequestMessage({ type: 'success', text: data.message });
                setRequestReason('');
            } else {
                setRequestMessage({ type: 'error', text: data.message || 'Gửi yêu cầu thất bại.' });
            }
        } catch (error) {
            setRequestMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
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
                    }}>S</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Student Portal</h1>
                </div>
                <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto' }}>Đăng xuất</button>
            </header>

            <main className="animate-slide-up" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="grid-cards" style={{ gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)' }}>
                    {/* Hồ sơ cá nhân */}
                    <div className="glass-card">
                        <h2 className="section-title">Hồ sơ cá nhân</h2>
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Họ và tên</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user.fullName}</div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Địa chỉ Email</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user.email}</div>
                        </div>
                    </div>

                    {/* Form Yêu cầu cấp quyền */}
                    <div className="glass-card">
                        <h2 className="section-title">Yêu cầu cấp quyền thêm</h2>
                        <form onSubmit={handleRequestRole} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Email xác nhận</label>
                                <input 
                                    type="text" 
                                    value={user.email} 
                                    disabled 
                                    className="input-field"
                                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Lý do yêu cầu</label>
                                <textarea 
                                    value={requestReason}
                                    onChange={(e) => setRequestReason(e.target.value)}
                                    placeholder="Ví dụ: Cần quyền đăng ký lớp..."
                                    required
                                    className="input-field"
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', width: 'auto' }}>
                                Gửi yêu cầu
                            </button>
                        </form>

                        {requestMessage.text && (
                            <div className={`alert ${requestMessage.type === 'success' ? 'alert-success' : 'alert-error'} mt-3`}>
                                {requestMessage.text}
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-card mt-4">
                    <h2 className="section-title">Danh sách lớp học (Toàn bộ hệ thống)</h2>
                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã Lớp</th>
                                    <th>Tên Lớp</th>
                                    <th>Giảng viên</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((c: any) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td><span className="badge badge-primary">{c.class_code}</span></td>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.class_name}</td>
                                        <td>{c.teacher_code || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa phân công</span>}</td>
                                    </tr>
                                ))}
                                {classes.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center" style={{ padding: '30px' }}>Không có dữ liệu.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;

