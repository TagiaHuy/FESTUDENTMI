import { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'USER' // Mặc định role là USER
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [errorDetails, setErrorDetails] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setErrorDetails(null);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.status === 'success') {
                setMessage({ type: 'success', text: "Đăng ký thành công! Bạn có thể đăng nhập ngay." });
                alert("Đăng ký thành công!");
            } else {
                // LỖI: Hiển thị toàn bộ lỗi kỹ thuật (Security Misconfiguration)
                setMessage({ type: 'error', text: data.message || "Đăng ký thất bại." });
                setErrorDetails(data);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
            setErrorDetails(err);
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #ddd', padding: '30px', borderRadius: '8px' }}>
                <h2 style={{ textAlign: 'center' }}>Đăng ký tài khoản</h2>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>(Phiên bản Vulnerable)</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="text" 
                        name="fullName"
                        placeholder="Họ và tên" 
                        onChange={handleChange} 
                        style={styles.input}
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        onChange={handleChange} 
                        style={styles.input}
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Mật khẩu" 
                        onChange={handleChange} 
                        style={styles.input}
                    />

                    {/* LỖI: Input ẩn có thể can thiệp qua DevTools để sửa role thành ADMIN */}
                    <input type="hidden" name="role" value={formData.role} />

                    <button type="submit" style={styles.submitBtn}>
                        Đăng ký
                    </button>
                </form>

                {message.text && (
                    <div style={{ 
                        marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Hiển thị lỗi kỹ thuật nguy hiểm (A02) */}
                {errorDetails && (
                    <div style={{ color: 'red', marginTop: '20px', backgroundColor: '#fff5f5', padding: '15px', border: '1px solid red', borderRadius: '4px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>⚠️ Thông tin Debug (Security Misconfiguration):</h4>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px' }}>
                            {JSON.stringify(errorDetails, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    submitBtn: { padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;
