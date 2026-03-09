import { useState, useEffect } from 'react';

const PendingRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/students/pending-requests');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError(err);
        }
    };

    const handleApprove = async (email: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn cấp quyền cho ${email}?`)) return;

        try {
            const response = await fetch('/api/students/approve-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert(data.message);
                fetchRequests(); // Tải lại danh sách sau khi duyệt thành công
            } else {
                alert(data.message || 'Phê duyệt thất bại.');
            }
        } catch (error) {
            alert('Không thể kết nối đến Server!');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Danh sách yêu cầu cấp quyền Admin</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>* Chỉ Admin mới có quyền xem danh sách này (A01: Broken Access Control nếu User truy cập được)</p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Lý do</th>
                        <th style={styles.th}>Thời gian</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((r: any) => (
                            <tr key={r.id}>
                                <td style={styles.td}>{r.id}</td>
                                <td style={styles.td}>{r.email}</td>
                                <td style={styles.td}>{r.reason}</td>
                                <td style={styles.td}>{new Date(r.created_at).toLocaleString()}</td>
                                <td style={styles.td}>
                                    <span style={{ 
                                        padding: '3px 8px', 
                                        borderRadius: '10px', 
                                        fontSize: '11px',
                                        backgroundColor: '#fff3cd', 
                                        color: '#856404',
                                        border: '1px solid #ffeeba'
                                    }}>
                                        {r.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => handleApprove(r.email)} style={styles.approveBtn}>Duyệt</button>
                                    <button onClick={() => alert('Chức năng Từ chối đang được phát triển')} style={styles.rejectBtn}>Từ chối</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ ...styles.td, textAlign: 'center' }}>Không có yêu cầu nào đang chờ.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {error && (
                <div style={{ color: 'red', marginTop: '20px', padding: '10px', background: '#fee' }}>
                    <strong>Lỗi lấy dữ liệu:</strong> {JSON.stringify(error)}
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#fff' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9', fontSize: '14px' },
    td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px' },
    approveBtn: { backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '12px' },
    rejectBtn: { backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
};

export default PendingRequests;
