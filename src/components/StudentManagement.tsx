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
        <div style={{ padding: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Quản lý Sinh viên</h3>
            
            <div style={styles.searchContainer}>
                <h4>Tìm kiếm sinh viên</h4>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Nhập tên sinh viên cần tìm..." 
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={styles.input}
                    />
                    <button type="submit" style={styles.searchBtn} disabled={loading}>
                        {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </form>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    * Mẹo: Thử nhập <code>' OR 1=1 --</code> để kiểm tra lỗi SQL Injection.
                </p>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Mã SV</th>
                            <th style={styles.th}>Họ và Tên</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Ngày sinh</th>
                            <th style={styles.th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((s: any) => (
                                <tr key={s.id}>
                                    <td style={styles.td}><strong>{s.student_code}</strong></td>
                                    <td style={styles.td}>{s.full_name}</td>
                                    <td style={styles.td}>{s.email}</td>
                                    <td style={styles.td}>{s.date_of_birth || 'N/A'}</td>
                                    <td style={styles.td}>
                                        <button onClick={() => alert("Xem chi tiết hồ sơ " + s.student_code)} style={styles.actionBtn}>Chi tiết</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#999' }}>
                                    {loading ? 'Đang tải dữ liệu...' : 'Không có kết quả nào được tìm thấy.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    searchContainer: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' },
    input: { flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    searchBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    tableContainer: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
    actionBtn: { backgroundColor: '#f8f9fa', color: '#000', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
};

export default StudentManagement;
