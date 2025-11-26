import "./assets/css/main.css";
import anhlogo from "./assets/images//Ten-truong-do-1000x159.png";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Hàm tiện ích để lấy số lượng loại sản phẩm trong giỏ
const getInitialCartCount = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart).length : 0;
};

const Layout = () => {
  const [user, setUser] = useState(null);
  // Khởi tạo cartCount bằng số lượng hiện có trong localStorage
  const [cartCount, setCartCount] = useState(getInitialCartCount()); 
  const navigate = useNavigate();

  // 1. TẠO HÀM UPDATECARTCOUNT ĐỂ TRUYỀN XUỐNG CON
  const updateCartCount = (count) => {
      // count ở đây là cart.length (tổng số loại sản phẩm)
      setCartCount(count); 
  };

  useEffect(() => {
    // Tải thông tin người dùng
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Tải số lượng giỏ hàng ban đầu (đã được xử lý ở useState)
    // Nếu bạn muốn reload lại số lượng mỗi khi vào trang, bạn có thể gọi lại getInitialCartCount() ở đây.
    // Dùng updateCartCount(getInitialCartCount());

  }, []); // Chỉ chạy một lần khi component mount

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="app-layout"> 
      <header className="main-header">
        
        {/* TOP BAR */}
        <div className="top-bar">
          <div className="top-bar-content">
            <ul className="top-nav-list">
              <li><a href="/">TRANG CHỦ</a></li>
              <li><a href="/trang1">SẢN PHẨM</a></li>
              <li><a href="/admin/products">QUẢN TRỊ</a></li>
            </ul>

            {/* User login/logout */}
            <div className="top-bar-user-area">
              {user ? (
                <>
                  <span className="username">👤 {user.username}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <a href="/login" className="login-link">Đăng nhập</a>
              )}
            </div>
          </div>
        </div>

        {/* BANNER & LOGO */}
        <div className="banner-section">
          <div className="logo-container">
            <img src={anhlogo} alt="Logo" className="site-logo" />
          </div>
        </div>

        {/* MENU BAR (Navigation) */}
        <div className="menubar">
          <div className="menubar-left">
            <a href="/ProductDetail" className="menu-item">Menu 1</a>
            <a href="/Chitietsanpham" className="menu-item">Menu 2</a>
            <a href="/menu3" className="menu-item">Menu 3</a>
          </div>

          <div className="menubar-right-tools">
            {/* Ô tìm kiếm */}
            <div className="search-container">
              <input type="text" placeholder="Tìm kiếm sản phẩm..." className="search-input" />
              <button className="search-btn">🔍</button>
            </div>

            {/* GIỎ HÀNG (Cart icon) */}
            <div 
              className="cart-box"
              onClick={() => navigate("/cart")}
              title="Xem giỏ hàng"
            >
              🛒
              <span className="cart-count">{cartCount}</span> {/* HIỂN THỊ SỐ LƯỢNG MỚI */}
            </div>
          </div>
        </div>
      </header>

      <main>
        <div id="container" className="container">
          {/* 2. TRUYỀN STATE VÀ HÀM QUA OUTLET CONTEXT */}
          <Outlet context={{ user, updateCartCount, cartCount }} /> 
          {/* ☝️ Đã thêm context={{ user, updateCartCount, cartCount }} */}
        </div>
      </main>

      <footer className="main-footer">
        
        {/* Cột 1: Thông tin liên hệ */}
        <div className="footer-column">
          <h4>THÔNG TIN LIÊN HỆ</h4>
          <p>
            <span className="footer-icon">📍</span> 
            Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
          </p>
          <p>
            <span className="footer-icon">📞</span> 
            Điện thoại: (028) 1234 5678
          </p>
          <p>
            <span className="footer-icon">✉️</span> 
            Email: contact@eshop.com
          </p>
          <p>
            <span className="footer-icon">🕒</span> 
            Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 6)
          </p>
        </div>

        {/* Cột 2: Bản đồ Google Maps (Bên phải) */}
        <div className="footer-column">
          <h4>VỊ TRÍ CỬA HÀNG</h4>
          <div className="footer-map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.498006322971!2d106.69748687508499!3d10.772596989370783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f36f3c5f40f%3A0x280e8e9e14a27549!2sIndependence%20Palace!5e0!3m2!1sen!2s!4v1701140000000!5m2!1sen!2s" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí cửa hàng"
            ></iframe>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default Layout;