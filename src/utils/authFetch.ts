export const authFetch = async (url: string, options: RequestInit = {}) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    // Khởi tạo headers nếu chưa có
    const headers = new Headers(options.headers || {});

    // Thêm Content-Type mặc định nếu data truyền lên không phải là FormData
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Gắn Bearer Token vào Header
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Thực hiện hàm fetch nguyên bản với headers mới
    return fetch(url, {
        ...options,
        headers,
    });
};
