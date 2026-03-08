import { useEffect, useState } from 'react';

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
            const response = await fetch('http://localhost:8081/api/classes');
            const data = await response.json();
            setClasses(data);
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
            const response = await fetch('http://localhost:8081/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <div style={{ padding: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Quản lý Lớp học</h3>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* Form Tạo Lớp mới */}
                <div style={{ flex: '1', minWidth: '350px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', alignSelf: 'flex-start' }}>
                    <h4>Tạo Lớp học mới</h4>
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
                            <label>Mã Giảng viên:</label><br/>
                            <input 
                                name="teacherCode" 
                                value={formData.teacherCode} 
                                onChange={handleChange} 
                                required 
                                placeholder="Ví dụ: GV8"
                                style={styles.input} 
                            />
                        </div>
                        <div>
                            <label>Mô tả:</label><br/>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                required 
                                placeholder="Mô tả chi tiết về nội dung lớp học..."
                                style={{ ...styles.input, minHeight: '80px', fontFamily: 'inherit' }} 
                            />
                        </div>
                        <button type="submit" style={styles.submitBtn}>Tạo lớp học</button>
                    </form>

                    {message.text && (
                        <div style={{ 
                            marginTop: '15px', padding: '10px', borderRadius: '4px',
                            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: message.type === 'success' ? '#155724' : '#721c24',
                            border: '1px solid currentColor'
                        }}>
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Danh sách Lớp học */}
                <div style={{ flex: '2', minWidth: '600px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4>Danh sách toàn bộ lớp học</h4>
                        <button onClick={fetchClasses} style={styles.refreshBtn}>Làm mới</button>
                    </div>

                    {loading ? (
                        <p>Đang tải dữ liệu...</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Mã Lớp</th>
                                    <th style={styles.th}>Tên Lớp</th>
                                    <th style={styles.th}>Mã GV</th>
                                    <th style={styles.th}>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((c: any) => (
                                    <tr key={c.id}>
                                        <td style={styles.td}><strong>{c.class_code}</strong></td>
                                        <td style={styles.td}>{c.class_name}</td>
                                        <td style={styles.td}>{c.teacher_code || 'N/A'}</td>
                                        <td style={{ ...styles.td, fontSize: '13px', color: '#666' }}>{c.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    submitBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    refreshBtn: { backgroundColor: '#f8f9fa', color: '#000', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' }
};

export default ClassManagement;
