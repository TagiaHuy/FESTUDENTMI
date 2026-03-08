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
            const response = await fetch('http://localhost:8081/api/teachers');
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
            const response = await fetch('http://localhost:8081/api/teachers', {
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
        <div style={{ padding: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Quản lý Giảng viên</h3>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* Form Tạo mới */}
                <div style={{ flex: '1', minWidth: '350px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', alignSelf: 'flex-start' }}>
                    <h4>Tạo tài khoản Giảng viên mới</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label>Họ và tên:</label><br/>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div>
                            <label>Email:</label><br/>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div>
                            <label>Khoa / Bộ môn:</label><br/>
                            <input name="department" value={formData.department} onChange={handleChange} required style={styles.input} />
                        </div>
                        <div>
                            <label>Mật khẩu tạm thời:</label><br/>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
                        </div>
                        <button type="submit" style={styles.submitBtn}>Tạo tài khoản</button>
                    </form>

                    {message.text && (
                        <div style={{ 
                            marginTop: '20px', padding: '15px', borderRadius: '4px',
                            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: message.type === 'success' ? '#155724' : '#721c24',
                            border: '1px solid currentColor'
                        }}>
                            <strong>{message.text}</strong>
                            {message.teacherCode && <p style={{ margin: '5px 0 0 0' }}>Mã: {message.teacherCode}</p>}
                        </div>
                    )}
                </div>

                {/* Bảng Danh sách */}
                <div style={{ flex: '2', minWidth: '600px' }}>
                    <h4>Danh sách Giảng viên hệ thống</h4>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Mã GV</th>
                                <th style={styles.th}>Họ tên</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Khoa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((t: any) => (
                                <tr key={t.id}>
                                    <td style={styles.td}>{t.teacher_code}</td>
                                    <td style={styles.td}>{t.full_name}</td>
                                    <td style={styles.td}>{t.email}</td>
                                    <td style={styles.td}>{t.department}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    submitBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', border: '1px solid #eee' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }
};

export default TeacherManagement;
