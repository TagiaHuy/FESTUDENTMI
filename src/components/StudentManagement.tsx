import { useState } from 'react';

const StudentManagement = () => {
    const [searchName, setSearchName] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchName.trim()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/students/search?name=${encodeURIComponent(searchName)}`);
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setStudents(data);
            } else {
                setStudents([]);
            }
        } catch (err) {
            setError("Không thể kết nối đến server hoặc lỗi tìm kiếm.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }} className="animate-fade-in">
            <h3 className="section-title">Quản lý Sinh viên</h3>
            
            <div className="glass-card" style={{ marginBottom: '20px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>Tìm kiếm sinh viên</h4>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Nhập tên sinh viên cần tìm..." 
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: '40px', marginBottom: 0 }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: 'auto', padding: '10px 25px' }}>
                        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

            <div className="glass-card">
                <div className="table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Mã SV</th>
                                <th>Họ và Tên</th>
                                <th>Email</th>
                                <th>Ngày sinh</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((s: any) => (
                                    <tr key={s.id}>
                                        <td><span className="badge badge-primary">{s.student_code}</span></td>
                                        <td style={{ fontWeight: 500 }}>{s.full_name}</td>
                                        <td><a href={`mailto:${s.email}`}>{s.email}</a></td>
                                        <td>{s.date_of_birth || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>N/A</span>}</td>
                                        <td>
                                            <button onClick={() => alert("Xem chi tiết hồ sơ " + s.student_code)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Chi tiết</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center" style={{ padding: '40px', color: 'var(--text-muted)' }}>
                                        {loading ? (
                                            <div>
                                                <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                <span style={{ marginLeft: '10px' }}>Đang tải dữ liệu...</span>
                                            </div>
                                        ) : 'Không có kết quả nào được tìm thấy.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
