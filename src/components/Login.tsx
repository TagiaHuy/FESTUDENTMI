import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [debugInfo, setDebugInfo] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setDebugInfo(null);

        try {
            const response = await fetch('http://localhost:8081/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            // Kiểm tra theo status 'success' mới của bạn
            if (data.status === "success") {
                setMessage({ type: 'success', text: data.message });

                // LỖI BẢO MẬT (Theo yêu cầu bài tập): Lưu toàn bộ user và token vào localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                alert("Đăng nhập thành công! Chào mừng " + data.user.fullName);
                window.location.reload();
            } else {
                setMessage({ type: 'error', text: data.message || "Đăng nhập thất bại" });
                if (data.stackTrace) setDebugInfo(data);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Hệ thống Quản lý Sinh viên</h2>
                <p style={styles.subtitle}>(Dữ liệu thực tế từ API đã sửa lỗi recursion)</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label>Email:</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Mật khẩu:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button type="submit" style={styles.button}>Đăng nhập</button>
                </form>

                {message.text && (
                    <div style={{
                        ...styles.alert,
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24'
                    }}>
                        {message.text}
                    </div>
                )}

                {debugInfo && (
                    <div style={styles.debugBox}>
                        <h4 style={{margin: '0 0 10px 0'}}>⚠️ Thông tin Debug:</h4>
                        <pre style={styles.pre}>{JSON.stringify(debugInfo, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' },
    title: { textAlign: 'center', color: '#1c1e21', marginBottom: '5px' },
    subtitle: { textAlign: 'center', color: '#606770', fontSize: '14px', marginBottom: '30px' },
    inputGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#1877f2', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    alert: { marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center', fontSize: '14px' },
    debugBox: { marginTop: '20px', padding: '15px', backgroundColor: '#2d2d2d', color: '#00ff00', borderRadius: '4px', fontSize: '12px', overflowX: 'auto' },
    pre: { whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }
};

export default Login;
