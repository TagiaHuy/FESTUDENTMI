import { useState, useEffect } from 'react';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        department: '',
        password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '', teacherCode: '' });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('/api/teachers');
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error("Lỗi tải danh sách giảng viên:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '', teacherCode: '' });

        try {
            const response = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setMessage({ 
                    type: 'success', 
                    text: data.message, 
                    teacherCode: data.teacherCode 
                });
                setFormData({ fullName: '', email: '', department: '', password: '' });
                fetchTeachers(); // Tải lại danh sách sau khi tạo thành công
            } else {
                setMessage({ type: 'error', text: data.message || 'Tạo tài khoản thất bại.', teacherCode: '' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!', teacherCode: '' });
        }
    };

    return (
        <div style={{ padding: '20px' }} className="animate-fade-in">
            <h3 className="section-title">Quản lý Giảng viên</h3>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* Form Tạo mới */}
                <div className="glass-card" style={{ flex: '1', minWidth: '350px', alignSelf: 'flex-start' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Tạo tài khoản Giảng viên mới</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Họ và tên</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" placeholder="Nhập họ và tên..." />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="name@domain.com" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Khoa / Bộ môn</label>
                            <input name="department" value={formData.department} onChange={handleChange} required className="input-field" placeholder="Nhập khoa/bộ môn..." />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Mật khẩu tạm thời</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Tạo tài khoản</button>
                    </form>

                    {message.text && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mt-3`}>
                            <strong>{message.text}</strong>
                            {message.teacherCode && <p style={{ margin: '5px 0 0 0' }}>Mã: <code style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{message.teacherCode}</code></p>}
                        </div>
                    )}
                </div>

                {/* Bảng Danh sách */}
                <div className="glass-card" style={{ flex: '2', minWidth: '600px' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Danh sách Giảng viên hệ thống</h4>
                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Mã GV</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Khoa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((t: any) => (
                                    <tr key={t.id}>
                                        <td><span className="badge badge-primary">{t.teacher_code}</span></td>
                                        <td style={{ fontWeight: 500 }}>{t.full_name}</td>
                                        <td><a href={`mailto:${t.email}`}>{t.email}</a></td>
                                        <td><span className="badge badge-success">{t.department}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherManagement;
