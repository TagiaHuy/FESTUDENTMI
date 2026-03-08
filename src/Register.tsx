import { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'USER' // Mặc định role là USER
    });

    const [errorDetails, setErrorDetails] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.status === 'error') {
                // LỖI: Hiển thị toàn bộ lỗi kỹ thuật (Security Misconfiguration)
                setErrorDetails(data);
            } else {
                alert("Đăng ký thành công!");
            }
        } catch (err) {
            console.error(err);
            setErrorDetails({ message: "Lỗi kết nối server", originalError: err });
        }
    };

    return (        
        <div style={{ padding: '20px' }}>
            <h2>Đăng ký hệ thống (Vulnerable)</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Họ tên" 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                /><br/>
                <input 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                /><br/>
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                /><br/>

                {/* LỖI: Input ẩn hoặc có thể can thiệp qua devtools để sửa role thành ADMIN */}
                <input type="hidden" value={formData.role} />

                <button type="submit">Đăng ký</button>
            </form>

            {/* Hiển thị lỗi nguy hiểm nếu có */}
            {errorDetails && (
                <div style={{ color: 'red', marginTop: '20px', backgroundColor: '#fdd', padding: '10px' }}>
                    <h3>Lỗi từ Server (Stack Trace):</h3>
                    <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Register;
