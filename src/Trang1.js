import { products } from "./data/product";
import React, { useEffect } from "react";
// Import thêm useOutletContext để liên kết với Layout
import { useNavigate, useOutletContext } from "react-router-dom"; 

// --- Hàm tiện ích Giỏ hàng (Tương tự như ListProducts_SP) ---
const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};
// -------------------------------------------------------------

const Trang1 = () => {
  const navigate = useNavigate();
  // Lấy hàm cập nhật số lượng từ Layout
  const { updateCartCount } = useOutletContext(); 

  // Cập nhật số lượng giỏ hàng ban đầu khi component tải
  useEffect(() => {
    const storedCart = getCartFromLocalStorage();
    if (updateCartCount) {
        updateCartCount(storedCart.length);
    }
  }, [updateCartCount]);

  // --- LOGIC THÊM VÀO GIỎ HÀNG ---
  const addToCart = (product) => {
    let currentCart = getCartFromLocalStorage();
    
    // 1. Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Nếu đã có, tăng số lượng
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Nếu chưa có, thêm mới với trường 'quantity' = 1
      currentCart.push({
        ...product,
        quantity: 1, 
      });
    }

    saveCartToLocalStorage(currentCart);

    // 2. GỌI HÀM TỪ LAYOUT ĐỂ CẬP NHẬT HEADER
    if (updateCartCount) {
        // Truyền tổng số loại sản phẩm (tổng số mục trong mảng)
        updateCartCount(currentCart.length); 
    }
    
    // 3. HIỂN THỊ THÔNG BÁO VÀ HỎI XEM GIỎ HÀNG
    const shouldViewCart = window.confirm(
        `✅ Đã thêm 1 x ${product.title} vào giỏ hàng!\nBạn có muốn xem giỏ hàng ngay không?`
    );
    
    if (shouldViewCart) {
        navigate("/cart"); 
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách sản phẩm</h2>
      <div
        style={{
          display: "grid",
          // Đảm bảo cố định 3 cột hoặc để responsive như cũ (minmax 200px)
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "16px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              display: "flex", // Thêm flex để dễ dàng căn chỉnh
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {/* Vùng thông tin (có thể click để xem chi tiết) */}
            <div 
              onClick={() => navigate(`/sanpham/${p.id}`)}
              style={{ flexGrow: 1, cursor: 'pointer' }}
            >
                <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: "100px", height: "100px", objectFit: "contain", marginBottom: '10px' }}
                />
                <h4 style={{ margin: '0 0 5px' }}>{p.title}</h4>
                <p style={{ fontWeight: 'bold', color: '#e63946' }}>${p.price}</p>
            </div>
            
            {/* Nút thêm giỏ hàng (Không click dẫn đến chi tiết) */}
            <button
                onClick={() => addToCart(p)}
                style={{
                    marginTop: "10px",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "5px",
                    background: "#1d3557",
                    color: "white",
                    cursor: "pointer",
                    transition: "background 0.3s",
                }}
            >
                ➕ Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Trang1;