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
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Cổng Thông Tin Sinh Viên</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
            </header>

            <main style={styles.main}>
                <div style={styles.card}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Hồ sơ cá nhân</h2>
                    <div style={styles.infoRow}><strong>Họ tên:</strong> <span>{user.fullName}</span></div>
                    <div style={styles.infoRow}><strong>Email:</strong> <span>{user.email}</span></div>
                    <div style={styles.warningBox}>
                        <p style={{ margin: 0, color: 'red' }}>🚨 Lộ mật khẩu: <code>{user.password}</code></p>
                    </div>
                </div>

                {/* Form Yêu cầu cấp quyền */}
                <div style={{ ...styles.card, marginTop: '20px' }}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Yêu cầu cấp quyền Admin</h2>
                    <form onSubmit={handleRequestRole} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <label>Email xác nhận:</label><br/>
                            <input 
                                type="text" 
                                value={user.email} 
                                disabled 
                                style={{ width: '100%', padding: '8px', background: '#f0f0f0', border: '1px solid #ccc' }} 
                            />
                        </div>
                        <div>
                            <label>Lý do yêu cầu:</label><br/>
                            <textarea 
                                value={requestReason}
                                onChange={(e) => setRequestReason(e.target.value)}
                                placeholder="Ví dụ: Em là sinh viên mới nhập học."
                                required
                                style={{ width: '100%', padding: '8px', minHeight: '80px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button type="submit" style={styles.submitBtn}>Gửi yêu cầu</button>
                    </form>

                    {requestMessage.text && (
                        <div style={{ 
                            marginTop: '15px', padding: '10px', borderRadius: '4px',
                            backgroundColor: requestMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: requestMessage.type === 'success' ? '#155724' : '#721c24',
                            border: '1px solid currentColor'
                        }}>
                            {requestMessage.text}
                        </div>
                    )}
                </div>

                <div style={{ ...styles.card, marginTop: '20px' }}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Danh sách lớp học hệ thống</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Mã Lớp</th>
                                <th style={styles.th}>Tên Lớp</th>
                                <th style={styles.th}>Giảng viên</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((c: any) => (
                                <tr key={c.id}>
                                    <td style={styles.td}>{c.id}</td>
                                    <td style={styles.td}>{c.class_code}</td>
                                    <td style={styles.td}>{c.class_name}</td>
                                    <td style={styles.td}>{c.teacher_code || 'Chưa phân công'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#000' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: '2px solid #eee' },
    logoutBtn: { backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    submitBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    main: { padding: '30px 40px', maxWidth: '1000px', margin: '0 auto' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    infoRow: { marginBottom: '10px', display: 'flex', justifyContent: 'space-between' },
    warningBox: { border: '1px solid red', padding: '10px', marginTop: '15px', backgroundColor: '#fff5f5' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '10px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9' },
    td: { padding: '10px', borderBottom: '1px solid #eee' }
};

export default UserDashboard;

