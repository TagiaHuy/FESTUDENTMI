import { useEffect, useState } from 'react';

const StudentDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [myClasses, setMyClasses] = useState<any[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchClasses();
            fetchMyClasses(parsedUser.studentCode);
        }
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await fetch('http://localhost:8081/api/classes');
            const data = await res.json();
            setClasses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyClasses = async (studentCode: string) => {
        try {
            const res = await fetch(`http://localhost:8081/api/students/my-classes?studentCode=${studentCode}`);
            const data = await res.json();
            setMyClasses(data);
        } catch (err) {
            console.error(err);
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

    const handleRegisterClass = async (classCode: string, className: string) => {
        if (!window.confirm(`Bạn có muốn đăng ký vào lớp: ${className}?`)) return;

        try {
            const response = await fetch('http://localhost:8081/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentCode: user.studentCode,
                    classCode: classCode,
                    email: user.email,
                    grade: 0 // Điểm mặc định
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert(data.message);
                fetchMyClasses(user.studentCode); // Cập nhật lại danh sách lớp đã đăng ký
            } else {
                alert(data.message || 'Đăng ký lớp học thất bại.');
            }
        } catch (error) {
            alert('Không thể kết nối đến Server!');
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Cổng Thông Tin Sinh Viên (ROLE_STUDENT)</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
            </header>

            <main style={styles.main}>
                <div style={styles.card}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Hồ sơ sinh viên</h2>
                    <div style={styles.infoRow}><strong>Mã sinh viên:</strong> <span style={{ fontWeight: 'bold', color: '#000' }}>{user.studentCode}</span></div>
                    <div style={styles.infoRow}><strong>Họ tên:</strong> <span>{user.fullName}</span></div>
                    <div style={styles.infoRow}><strong>Email:</strong> <span>{user.email}</span></div>
                    <div style={styles.warningBox}>
                        <p style={{ margin: 0, color: 'red' }}>🚨 Bảo mật: Mật khẩu của bạn là <code>{user.password}</code></p>
                    </div>
                </div>

                {/* Danh sách lớp ĐÃ đăng ký */}
                <div style={{ ...styles.card, marginTop: '20px', border: '1px solid #27ae60' }}>
                    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#27ae60' }}>Khóa học của tôi</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Mã Lớp</th>
                                <th style={styles.th}>Tên Lớp</th>
                                <th style={styles.th}>Ngày đăng ký</th>
                                <th style={styles.th}>Điểm số</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myClasses.length > 0 ? myClasses.map((c: any) => (
                                <tr key={c.id}>
                                    <td style={styles.td}>{c.class_code}</td>
                                    <td style={styles.td}>{c.class_name}</td>
                                    <td style={styles.td}>{new Date(c.enrolled_at).toLocaleDateString()}</td>
                                    <td style={styles.td}><strong>{c.grade}</strong></td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} style={{...styles.td, textAlign: 'center'}}>Bạn chưa đăng ký lớp học nào.</td></tr>
                            )}
                        </tbody>
                    </table>
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
                                <th style={styles.th}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((c: any) => (
                                <tr key={c.id}>
                                    <td style={styles.td}>{c.id}</td>
                                    <td style={styles.td}>{c.class_code}</td>
                                    <td style={styles.td}>{c.class_name}</td>
                                    <td style={styles.td}>{c.teacher_code || 'Chưa phân công'}</td>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => handleRegisterClass(c.class_code, c.class_name)}
                                            style={styles.registerBtn}
                                        >
                                            Đăng ký học
                                        </button>
                                    </td>
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
    registerBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    main: { padding: '30px 40px', maxWidth: '1000px', margin: '0 auto' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    infoRow: { marginBottom: '10px', display: 'flex', justifyContent: 'space-between' },
    warningBox: { border: '1px solid red', padding: '10px', marginTop: '15px', backgroundColor: '#fff5f5' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '10px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9' },
    td: { padding: '10px', borderBottom: '1px solid #eee' }
};

export default StudentDashboard;
