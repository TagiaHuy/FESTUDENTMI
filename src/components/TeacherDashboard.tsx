import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

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
            const response = await authFetch(`/api/classes/by-teacher?teacherCode=${teacherCode}`);
            const data = await response.json();
            setMyClasses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi tải danh sách lớp học:", error);
        }
    };

    const fetchStudentsInClass = async (classCode: string) => {
        try {
            const response = await authFetch(`/api/students?classCode=${classCode}`);
            const data = await response.json();
            setStudents(Array.isArray(data) ? data : []);
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
            const response = await authFetch('/api/students/update-grade', {
                method: 'PUT',
                body: JSON.stringify({
                    studentCode: student.student_code,
                    classCode: selectedClass.class_code,
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
            const response = await authFetch('/api/classes', {
                method: 'POST',
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

    if (!user) return <div style={{ padding: '20px' }}>Đang tải...</div>;

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
                    }}>T</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Teacher Portal</h1>
                </div>
                <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto' }}>Đăng xuất</button>
            </header>

            <main className="animate-slide-up">
                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Cột trái: Hồ sơ & Tạo lớp */}
                    <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-card">
                            <h2 className="section-title">Hồ sơ Giảng viên</h2>
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Mã giảng viên</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--primary-color)' }}>{user.teacherCode}</div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Họ và tên</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{user.fullName}</div>
                            </div>
                        </div>

                        <div className="glass-card">
                            <h2 className="section-title">Tạo Lớp học mới</h2>
                            <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Tên lớp học</label>
                                    <input 
                                        name="className" 
                                        value={formData.className} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Ví dụ: Lập trình Java"
                                        className="input-field" 
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Mô tả lớp học</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Ví dụ: Lớp học về Spring Boot..."
                                        className="input-field"
                                        style={{ minHeight: '80px', resize: 'vertical' }} 
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Tạo lớp học</button>
                            </form>
                            {message.text && (
                                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mt-3`}>
                                    {message.text}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cột phải: Danh sách lớp học & Chi tiết sinh viên */}
                    <div style={{ flex: '2', minWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-card">
                            <h2 className="section-title">Lớp học tôi giảng dạy</h2>
                            <div className="table-container">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Mã Lớp</th>
                                            <th>Tên Lớp</th>
                                            <th>Số SV</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myClasses.length > 0 ? myClasses.map((c: any) => (
                                            <tr key={c.id} style={selectedClass?.id === c.id ? { background: 'rgba(99, 102, 241, 0.1)', borderLeft: '3px solid var(--primary-color)' } : {}}>
                                                <td><span className="badge badge-primary">{c.class_code}</span></td>
                                                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.class_name}</td>
                                                <td><strong>{c.studentCount}</strong></td>
                                                <td>
                                                    <button onClick={() => handleViewDetails(c)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Xem sinh viên</button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={4} className="text-center" style={{ padding: '30px' }}>Bạn chưa tạo lớp học nào.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {selectedClass && (
                            <div className="glass-card animate-slide-up" style={{ border: '1px solid var(--primary-color)' }}>
                                <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', marginBottom: '15px' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Danh sách sinh viên: <span style={{ color: 'var(--primary-color)' }}>{selectedClass.class_code}</span></h2>
                                    <button onClick={() => setSelectedClass(null)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.8rem', width: 'auto' }}>Đóng ✖</button>
                                </div>
                                <div className="table-container">
                                    <table className="modern-table">
                                        <thead>
                                            <tr>
                                                <th>Mã SV</th>
                                                <th>Họ tên</th>
                                                <th>Email</th>
                                                <th>Điểm</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.length > 0 ? students.map((s: any) => (
                                                <tr key={s.id}>
                                                    <td>{s.student_code}</td>
                                                    <td style={{ fontWeight: 500 }}>{s.full_name}</td>
                                                    <td><a href={`mailto:${s.email}`}>{s.email}</a></td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                            <input 
                                                                type="number" 
                                                                id={`grade-${s.id}`}
                                                                defaultValue={s.grade}
                                                                className="input-field" 
                                                                style={{ width: '70px', padding: '6px 10px', textAlign: 'center' }} 
                                                            />
                                                            <button 
                                                                onClick={() => {
                                                                    const input = document.getElementById(`grade-${s.id}`) as HTMLInputElement;
                                                                    handleUpdateGrade(s, input.value);
                                                                }}
                                                                className="btn btn-success"
                                                                style={{ padding: '6px 12px', width: 'auto' }}
                                                            >
                                                                Lưu
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan={4} className="text-center" style={{ padding: '30px' }}>Chưa có sinh viên nào đăng ký lớp này.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
