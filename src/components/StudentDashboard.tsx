import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

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
            const res = await authFetch('/api/classes');
            const data = await res.json();
            setClasses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyClasses = async (_studentCode: string) => { // Tham số này có thể bỏ đi luôn nhưng giữ để khỏi sửa useeffect
        try {
            const res = await authFetch(`/api/students/my-classes`);
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
            const response = await authFetch(`/api/students/my-avatar`, {
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

    const handleRegisterClass = async (classCode: string, className: string) => {
        if (!window.confirm(`Bạn có muốn đăng ký vào lớp: ${className}?`)) return;

        try {
            const response = await authFetch('/api/students', {
                method: 'POST',
                body: JSON.stringify({
                    classCode: classCode,
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

            <main className="animate-slide-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Hồ sơ & Avatar */}
                    <div className="glass-card" style={{ flex: '1', minWidth: '320px' }}>
                        <h2 className="section-title">Hồ sơ sinh viên</h2>
                        
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ 
                                width: '120px', height: '120px', 
                                backgroundColor: 'rgba(255,255,255,0.05)', 
                                margin: '0 auto 15px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                borderRadius: '50%', overflow: 'hidden', 
                                border: '2px solid var(--primary-color)',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                            }}>
                                {user.avatar_path ? (
                                    <img src={`/${user.avatar_path}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>No Avatar</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    className="input-field" 
                                    style={{ padding: '8px', fontSize: '0.85rem', width: '200px' }} 
                                />
                                <button onClick={handleUploadAvatar} className="btn btn-primary" style={{ width: '200px', padding: '8px' }}>
                                    Upload Avatar
                                </button>
                            </div>
                            {uploadMessage.text && (
                                <p style={{ fontSize: '0.9rem', marginTop: '10px', color: uploadMessage.type === 'success' ? '#34d399' : '#f87171' }}>
                                    {uploadMessage.text}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Mã sinh viên</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--primary-color)' }}>{user.studentCode}</div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Họ tên</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user.fullName}</div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Email</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user.email}</div>
                        </div>
                    </div>

                    {/* Khóa học của tôi */}
                    <div className="glass-card" style={{ flex: '2', minWidth: '500px', borderTop: '4px solid var(--success-color)' }}>
                        <h2 className="section-title">Khóa học của tôi</h2>
                        <div className="table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Mã Lớp</th>
                                        <th>Tên Lớp</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Điểm số</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myClasses.length > 0 ? myClasses.map((c: any) => (
                                        <tr key={c.id}>
                                            <td><span className="badge badge-primary">{c.class_code}</span></td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.class_name}</td>
                                            <td>{new Date(c.enrolled_at).toLocaleDateString()}</td>
                                            <td><span style={{ 
                                                fontSize: '1.1rem', 
                                                fontWeight: 'bold',
                                                color: c.grade >= 5 ? 'var(--success-color)' : (c.grade > 0 ? 'var(--danger-color)' : 'var(--text-muted)')
                                            }}>{c.grade}</span></td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="text-center" style={{ padding: '30px' }}>Bạn chưa đăng ký lớp học nào.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Danh sách lớp hệ thống */}
                <div className="glass-card mt-4">
                    <h2 className="section-title">Danh sách lớp học hệ thống</h2>
                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã Lớp</th>
                                    <th>Tên Lớp</th>
                                    <th>Giảng viên</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((c: any) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td><span className="badge badge-primary">{c.class_code}</span></td>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.class_name}</td>
                                        <td>{c.teacher_code || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa phân công</span>}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleRegisterClass(c.class_code, c.class_name)}
                                                className="btn btn-secondary"
                                                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                            >
                                                Đăng ký học
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
