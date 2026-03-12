import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

const ClassManagement = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        className: '',
        description: '',
        teacherCode: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await authFetch('/api/classes');
            const data = await response.json();
            setClasses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi tải danh sách lớp học:", error);
        } finally {
            setLoading(false);
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
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setMessage({ type: 'success', text: data.message });
                setFormData({ className: '', description: '', teacherCode: '' });
                fetchClasses(); // Tải lại danh sách sau khi tạo thành công
            } else {
                setMessage({ type: 'error', text: data.message || 'Tạo lớp học thất bại.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
        }
    };

    return (
        <div style={{ padding: '20px' }} className="animate-fade-in">
            <h3 className="section-title">Quản lý Lớp học</h3>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* Form Tạo Lớp mới */}
                <div className="glass-card" style={{ flex: '1', minWidth: '350px', alignSelf: 'flex-start' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Tạo Lớp học mới</h4>
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
                            <label className="form-label">Mã Giảng viên</label>
                            <input 
                                name="teacherCode" 
                                value={formData.teacherCode} 
                                onChange={handleChange} 
                                required 
                                placeholder="Ví dụ: GV8"
                                className="input-field" 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Mô tả</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                                placeholder="Mô tả chi tiết về nội dung lớp học..."
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

                {/* Danh sách Lớp học */}
                <div className="glass-card" style={{ flex: '2', minWidth: '600px' }}>
                    <div className="flex-between" style={{ marginBottom: '20px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Danh sách toàn bộ lớp học</h4>
                        <button onClick={fetchClasses} className="btn btn-secondary" style={{ padding: '6px 15px', fontSize: '0.9rem', width: 'auto' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'text-top' }}>
                                <polyline points="23 4 23 10 17 10"></polyline>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                            </svg>
                            Làm mới
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center" style={{ padding: '40px', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <p style={{ marginTop: '15px' }}>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Mã Lớp</th>
                                        <th>Tên Lớp</th>
                                        <th>Mã GV</th>
                                        <th>Mô tả</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes.map((c: any) => (
                                        <tr key={c.id}>
                                            <td><span className="badge badge-primary">{c.class_code}</span></td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.class_name}</td>
                                            <td>
                                                {c.teacher_code ? 
                                                    <span className="badge badge-secondary">{c.teacher_code}</span> : 
                                                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>N/A</span>
                                                }
                                            </td>
                                            <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {c.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
