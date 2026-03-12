import { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';

const PendingRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await authFetch('/api/students/pending-requests');
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError(err);
        }
    };

    const handleApprove = async (email: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn cấp quyền cho ${email}?`)) return;

        try {
            const response = await authFetch('/api/students/approve-role', {
                method: 'POST',
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
        <div style={{ padding: '20px' }} className="animate-fade-in">
            <h3 className="section-title">Danh sách yêu cầu cấp quyền Admin</h3>

            <div className="glass-card">
                <div className="table-container">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Lý do</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? (
                                requests.map((r: any) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
                                        <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{r.reason}</td>
                                        <td>{new Date(r.created_at).toLocaleString()}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                backgroundColor: r.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                                                color: r.status === 'PENDING' ? '#f59e0b' : '#10b981',
                                                border: `1px solid ${r.status === 'PENDING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                            }}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleApprove(r.email)} className="btn btn-success" style={{ padding: '6px 14px', fontSize: '0.85rem', width: 'auto' }}>Duyệt</button>
                                                <button onClick={() => alert('Chức năng Từ chối đang được phát triển')} className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '0.85rem', width: 'auto' }}>Từ chối</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center" style={{ padding: '40px', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <path d="M3 9h18"></path>
                                                <path d="M9 21V9"></path>
                                            </svg>
                                            Chưa có yêu cầu nào đang chờ duyệt.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {error && (
                <div className="alert alert-error mt-4">
                    <strong>Lỗi lấy dữ liệu:</strong> {JSON.stringify(error)}
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
