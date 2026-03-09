import { useEffect, useState } from 'react';

const StudentDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [myClasses, setMyClasses] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadAvatar = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn một file!");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`http://localhost:8081/api/students/${user.id}/upload-avatar`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadMessage({ type: 'success', text: "Upload thành công! Server đã nhận file." });
                alert("Upload thành công!");
            } else {
                setUploadMessage({ type: 'error', text: data.message || "Lỗi khi upload file." });
            }
        } catch (error) {
            setUploadMessage({ type: 'error', text: "Không thể kết nối đến Server!" });
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
                    grade: 0
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert(data.message);
                fetchMyClasses(user.studentCode);
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
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Hồ sơ & Avatar */}
                    <div style={{ ...styles.card, flex: '1', minWidth: '300px' }}>
                        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Hồ sơ sinh viên</h2>
                        
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={styles.avatarPlaceholder}>
                                {user.avatar_path ? (
                                    <img src={`http://localhost:8081/${user.avatar_path}`} alt="Avatar" style={styles.avatarImg} />
                                ) : (
                                    "No Avatar"
                                )}
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <input type="file" onChange={handleFileChange} style={{ fontSize: '12px' }} />
                                <button onClick={handleUploadAvatar} style={styles.uploadBtn}>Upload Avatar</button>
                            </div>
                            {uploadMessage.text && (
                                <p style={{ fontSize: '12px', color: uploadMessage.type === 'success' ? 'green' : 'red' }}>
                                    {uploadMessage.text}
                                </p>
                            )}
                        </div>

                        <div style={styles.infoRow}><strong>Mã sinh viên:</strong> <span style={{ fontWeight: 'bold' }}>{user.studentCode}</span></div>
                        <div style={styles.infoRow}><strong>Họ tên:</strong> <span>{user.fullName}</span></div>
                        <div style={styles.infoRow}><strong>Email:</strong> <span>{user.email}</span></div>
                        
                        <div style={styles.warningBox}>
                            <h4 style={{ margin: '0 0 5px 0', color: 'red' }}>⚠️ Lỗ hổng A05: File Upload RCE</h4>
                            <p style={{ fontSize: '12px', margin: 0 }}>
                                Thử upload file <code>shell.jsp</code> hoặc <code>cmd.php</code> để kiểm tra quyền kiểm soát server.
                            </p>
                        </div>
                    </div>

                    {/* Khóa học của tôi */}
                    <div style={{ ...styles.card, flex: '2', minWidth: '500px', border: '1px solid #27ae60' }}>
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
                </div>

                {/* Danh sách lớp hệ thống */}
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
    uploadBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginLeft: '5px', fontSize: '12px' },
    registerBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    main: { padding: '30px 40px', maxWidth: '1200px', margin: '0 auto' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    infoRow: { marginBottom: '10px', display: 'flex', justifyContent: 'space-between' },
    warningBox: { border: '1px solid red', padding: '10px', marginTop: '15px', backgroundColor: '#fff5f5' },
    avatarPlaceholder: { width: '100px', height: '100px', backgroundColor: '#eee', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ddd' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' as 'cover' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '10px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9' },
    td: { padding: '10px', borderBottom: '1px solid #eee' }
};

export default StudentDashboard;
