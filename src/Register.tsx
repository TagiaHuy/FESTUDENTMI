import { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'USER' // Mặc định role là USER
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

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
                setMessage({ type: 'error', text: data.message || "Đăng ký thất bại." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
        }
    };

    return (
        <div className="container-center">
            <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="page-title" style={{ fontSize: '2rem' }}>Đăng ký tài khoản</h2>
                    <p className="page-subtitle" style={{ margin: 0 }}>(Phiên bản Vulnerable)</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Họ và tên</label>
                        <input 
                            type="text" 
                            name="fullName"
                            placeholder="Nhập họ và tên đầy đủ" 
                            onChange={handleChange} 
                            className="input-field"
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Nhập email của bạn" 
                            onChange={handleChange} 
                            className="input-field"
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Mật khẩu</label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)" 
                            onChange={handleChange} 
                            className="input-field"
                        />
                    </div>

                    {/* LỖI: Input ẩn có thể can thiệp qua DevTools để sửa role thành ADMIN */}
                    <input type="hidden" name="role" value={formData.role} />

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        Tạo tài khoản
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); /* App navigation logic handled outside */ }}>Đăng nhập</a>
                    </div>
                </form>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mt-4`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
