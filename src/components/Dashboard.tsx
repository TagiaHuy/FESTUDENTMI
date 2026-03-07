import { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);

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
        return <div style={{ padding: '20px' }}>Đang tải hoặc bạn chưa đăng nhập...</div>;
    }

    // Kiểm tra quyền ADMIN từ mảng roles phức tạp của bạn
    const isAdmin = user.roles && user.roles.some((role: any) => role.name === 'ROLE_ADMIN');

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Dashboard - Dữ liệu thực tế</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
            </header>

            <main style={styles.main}>
                <div style={styles.card}>
                    <h3>Chào mừng, {user.fullName}!</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Trạng thái:</strong> {user.isActive ? 'Đang hoạt động' : 'Bị khóa'}</p>
                    
                    <div style={styles.warningBox}>
                        <h4 style={{color: 'red', margin: '0 0 10px 0'}}>🚨 LỖI BẢO MẬT NGHIÊM TRỌNG:</h4>
                        <p>API của bạn đang trả về <strong>Mật khẩu thô (Plain-text Password)</strong>:</p>
                        <code style={{fontSize: '18px', background: 'yellow', padding: '5px'}}>
                            password: "{user.password}"
                        </code>
                        <p style={{fontSize: '12px', marginTop: '10px'}}>
                            * Đây là lỗi <strong>Sensitive Data Exposure</strong>. Kẻ tấn công chỉ cần vào F12 &rarr; Application &rarr; Local Storage là lấy được mật khẩu của bạn.
                        </p>
                    </div>

                    <p><strong>Quyền hạn (Roles):</strong></p>
                    <ul>
                        {user.roles && user.roles.map((role: any, idx: number) => (
                            <li key={idx}><strong>{role.name}</strong> (ID: {role.id})</li>
                        ))}
                    </ul>
                </div>

                {isAdmin && (
                    <div style={styles.adminSection}>
                        <h3>🛡️ Khu vực ADMIN (Phát hiện từ ROLE_ADMIN)</h3>
                        <p>Bạn có quyền quản lý hệ thống vì sở hữu role: ROLE_ADMIN</p>
                        <button style={styles.actionBtn}>Xóa dữ liệu hệ thống</button>
                    </div>
                )}

                <div style={styles.debugSection}>
                    <h4>Dữ liệu JSON gốc (Lưu ý vòng lặp vô tận):</h4>
                    <pre style={styles.pre}>
                        {/* Chỉ hiển thị một phần để tránh crash trình duyệt do circular reference */}
                        {JSON.stringify({ ...user, roles: "Content truncated to prevent recursion crash" }, null, 2)}
                    </pre>
                </div>
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'Arial', backgroundColor: '#f4f7f6', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', backgroundColor: '#2c3e50', color: '#fff' },
    logoutBtn: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
    main: { padding: '30px 40px' },
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' },
    warningBox: { border: '2px solid red', padding: '15px', borderRadius: '8px', backgroundColor: '#fff5f5', margin: '20px 0' },
    adminSection: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '2px solid #27ae60', marginBottom: '20px' },
    actionBtn: { backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' },
    debugSection: { marginTop: '40px', padding: '15px', backgroundColor: '#2d2d2d', color: '#00ff00', borderRadius: '4px', fontSize: '12px' },
    pre: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' }
};

export default Dashboard;
