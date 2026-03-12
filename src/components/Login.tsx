import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === "success") {
                setMessage({ type: 'success', text: data.message });
                
                // Lưu trữ đầy đủ thông tin định danh
                const userData = {
                    ...data.user,
                    studentCode: data.studentCode,
                    teacherCode: data.teacherCode
                };

                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', data.token);

                alert("Đăng nhập thành công! Chào mừng " + data.user.fullName);
                window.location.reload();
            } else {
                setMessage({ type: 'error', text: data.message || "Đăng nhập thất bại" });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến Server!' });
        }
    };

    return (
        <div className="container-center">
            <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ 
                        width: '64px', height: '64px', margin: '0 auto 1rem',
                        borderRadius: '16px', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 'bold', fontSize: '1.8rem', boxShadow: 'var(--shadow-glow)'
                    }}>SM</div>
                    <h2 className="page-title" style={{ fontSize: '2rem' }}>Chào mừng trở lại</h2>
                    <p className="page-subtitle" style={{ margin: 0 }}>Vui lòng đăng nhập vào tài khoản của bạn</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Email đăng nhập</label>
                        <input 
                            type="text" 
                            name="email" 
                            placeholder="Tên đăng nhập" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="input-field" 
                        />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div className="flex-between" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ margin: 0 }}>Mật khẩu</label>
                            <a href="#" style={{ fontSize: '0.85rem' }}>Quên mật khẩu?</a>
                        </div>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="input-field" 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                        Đăng nhập
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); /* App level navigation handler goes here if needed */ }}>Đăng ký ngay</a>
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

export default Login;
