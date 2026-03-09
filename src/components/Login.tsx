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
            const response = await fetch('http://localhost:8081/api/login', {
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
        <div style={{ padding: '40px', backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #ddd', padding: '30px', borderRadius: '8px' }}>
                <h2 style={{ textAlign: 'center' }}>Đăng nhập hệ thống</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} />
                    <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} style={styles.input} />
                    <button type="submit" style={styles.submitBtn}>Đăng nhập</button>
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
            </div>
        </div>
    );
};

const styles = {
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    submitBtn: { padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;
