import { useEffect, useState } from 'react';

const TeacherDashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [myClasses, setMyClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({
        className: '',
        description: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchMyClasses(parsedUser.teacherCode);
        }
    }, []);

    const fetchMyClasses = async (teacherCode: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/classes/by-teacher?teacherCode=${teacherCode}`);
            const data = await response.json();
            setMyClasses(data);
        } catch (error) {
            console.error("Lỗi tải danh sách lớp học:", error);
        }
    };

    const fetchStudentsInClass = async (classCode: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/students?classCode=${classCode}`);
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Lỗi tải danh sách sinh viên:", error);
        }
    };

    const handleViewDetails = (cls: any) => {
        setSelectedClass(cls);
        fetchStudentsInClass(cls.class_code);
    };

    const handleUpdateGrade = async (student: any, newGrade: string) => {
        try {
            const response = await fetch('http://localhost:8081/api/students/update-grade', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentCode: student.student_code,
                    classCode: selectedClass.class_code,
                    email: student.email,
                    grade: parseFloat(newGrade)
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert(data.message);
                fetchStudentsInClass(selectedClass.class_code);
            } else {
                alert(data.message || 'Cập nhật điểm thất bại.');
            }
        } catch (error) {
            alert('Không thể kết nối đến Server!');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:8081/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    className: formData.className,
                    description: formData.description,
                    teacherCode: user.teacherCode
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setMessage({ type: 'success', text: data.message });
                setFormData({ className: '', description: '' });
                fetchMyClasses(user.teacherCode);
            } else {
                setMessage({ type: 'error', text: data.message || 'Tạo lớp học thất bại.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    if (!user) return <div style={{ padding: '20px' }}>Đang tải...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Cổng Thông Tin Giảng Viên</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Đăng xuất</button>
            </header>

            <main style={styles.main}>
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Cột trái: Hồ sơ & Tạo lớp */}
                    <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={styles.card}>
                            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Hồ sơ Giảng viên</h2>
                            <div style={styles.infoRow}><strong>Mã GV:</strong> <span style={{ color: '#007bff', fontWeight: 'bold' }}>{user.teacherCode}</span></div>
                            <div style={styles.infoRow}><strong>Họ tên:</strong> <span>{user.fullName}</span></div>
                            <div style={styles.warningBox}>
                                <p style={{ margin: 0, color: 'red' }}>🚨 Bảo mật: Mật khẩu là <code>{user.password}</code></p>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Tạo Lớp học mới</h2>
                            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label>Tên lớp học:</label><br/>
                                    <input 
                                        name="className" 
                                        value={formData.className} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Ví dụ: Lập trình Java"
                                        style={styles.input} 
                                    />
                                </div>
                                <div>
                                    <label>Mô tả lớp học:</label><br/>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Ví dụ: Lớp học về Spring Boot..."
                                        style={{ ...styles.input, minHeight: '80px', fontFamily: 'inherit' }} 
                                    />
                                </div>
                                <button type="submit" style={styles.submitBtn}>Tạo lớp học</button>
                            </form>
                            {message.text && (
                                <div style={{ 
                                    marginTop: '15px', padding: '10px', borderRadius: '4px',
                                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                                    color: message.type === 'success' ? '#155724' : '#721c24'
                                }}>{message.text}</div>
                            )}
                        </div>
                    </div>

                    {/* Cột phải: Danh sách lớp học & Chi tiết sinh viên */}
                    <div style={{ flex: '2', minWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={styles.card}>
                            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lớp học tôi giảng dạy</h2>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Mã Lớp</th>
                                        <th style={styles.th}>Tên Lớp</th>
                                        <th style={styles.th}>Số SV</th>
                                        <th style={styles.th}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myClasses.length > 0 ? myClasses.map((c: any) => (
                                        <tr key={c.id} style={selectedClass?.id === c.id ? { backgroundColor: '#e7f3ff' } : {}}>
                                            <td style={styles.td}>{c.class_code}</td>
                                            <td style={styles.td}>{c.class_name}</td>
                                            <td style={styles.td}><strong>{c.studentCount}</strong></td>
                                            <td style={styles.td}>
                                                <button onClick={() => handleViewDetails(c)} style={styles.viewBtn}>Xem sinh viên</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} style={{...styles.td, textAlign: 'center'}}>Bạn chưa tạo lớp học nào.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {selectedClass && (
                            <div style={{ ...styles.card, border: '1px solid #007bff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                                    <h2 style={{ margin: 0 }}>Danh sách sinh viên: {selectedClass.class_code}</h2>
                                    <button onClick={() => setSelectedClass(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}>Đóng ✖</button>
                                </div>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Mã SV</th>
                                            <th style={styles.th}>Họ tên</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.length > 0 ? students.map((s: any) => (
                                            <tr key={s.id}>
                                                <td style={styles.td}>{s.student_code}</td>
                                                <td style={styles.td}>{s.full_name}</td>
                                                <td style={styles.td}>{s.email}</td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <input 
                                                            type="number" 
                                                            id={`grade-${s.id}`}
                                                            defaultValue={s.grade} 
                                                            style={{ width: '50px', padding: '3px' }} 
                                                        />
                                                        <button 
                                                            onClick={() => {
                                                                const input = document.getElementById(`grade-${s.id}`) as HTMLInputElement;
                                                                handleUpdateGrade(s, input.value);
                                                            }}
                                                            style={{ ...styles.viewBtn, backgroundColor: '#28a745' }}
                                                        >
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={4} style={{...styles.td, textAlign: 'center'}}>Chưa có sinh viên nào đăng ký lớp này.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#000' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#fff', borderBottom: '2px solid #eee' },
    logoutBtn: { backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    submitBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    viewBtn: { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    main: { padding: '30px 40px' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    infoRow: { marginBottom: '10px', display: 'flex', justifyContent: 'space-between' },
    warningBox: { border: '1px solid red', padding: '10px', marginTop: '15px', backgroundColor: '#fff5f5' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }
};

export default TeacherDashboard;
