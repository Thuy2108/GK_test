// CartPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

// ----------------------------------------------------
// HÀM TIỆN ÍCH QUẢN LÝ LOCALSTORAGE
// ----------------------------------------------------

const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  // Trả về mảng rỗng nếu không tìm thấy
  return cart ? JSON.parse(cart) : []; 
};

const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// ----------------------------------------------------
// COMPONENT CHÍNH
// ----------------------------------------------------

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  // Lấy hàm cập nhật số lượng giỏ hàng từ Layout
  // Lưu ý: Đảm bảo Layout của bạn truyền hàm này qua context
  const { updateCartCount } = useOutletContext(); 

  useEffect(() => {
    // 1. Tải dữ liệu giỏ hàng khi component khởi tạo
    const currentCart = getCartFromLocalStorage();
    setCartItems(currentCart);
    
    // 2. Cập nhật số lượng trên Header (sử dụng tổng số loại sản phẩm)
    if (updateCartCount) {
        updateCartCount(currentCart.length);
    }
  }, [updateCartCount]);

  // --- HÀM XỬ LÝ SỐ LƯỢNG ---
  const handleQuantityChange = (id, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        // Đảm bảo số lượng không nhỏ hơn 1
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
    
    // Cập nhật số lượng loại sản phẩm trên Header
    if (updateCartCount) {
        updateCartCount(updatedCart.length);
    }
  };
    
  // --- HÀM XÓA SẢN PHẨM ---
  const handleRemoveItem = (id) => {
    // Lọc ra sản phẩm có ID cần xóa
    const updatedCart = cartItems.filter(item => item.id !== id);
    
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
    
    // Cập nhật số lượng loại sản phẩm trên Header
    if (updateCartCount) {
        updateCartCount(updatedCart.length);
    }
    
    alert("Đã xóa sản phẩm khỏi giỏ hàng!");
  };
    
  // Tính tổng tiền (Giá * Số lượng)
  const totalAmount = cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
  );

  return (
    <div className="cart-page-container" style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '25px', borderBottom: '3px solid #1d3557', paddingBottom: '15px', color: '#1d3557' }}>
        🛒 Giỏ hàng của bạn ({cartItems.length} loại sản phẩm)
      </h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', border: '2px dashed #ccc', borderRadius: '8px' }}>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>Giỏ hàng chưa có sản phẩm nào. Hãy mua sắm thôi!</p>
          <button 
            onClick={() => navigate("/")}
            style={{ padding: '12px 25px', background: '#e63946', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', marginTop: '15px' }}
          >
            ← Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div>
          {/* DANH SÁCH SẢN PHẨM TRONG GIỎ */}
          <div className="cart-items-list" style={{ marginBottom: '30px' }}>
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="cart-item" 
                style={{ display: 'flex', borderBottom: '1px solid #ddd', padding: '20px 0', alignItems: 'center', backgroundColor: '#fff', borderRadius: '5px', marginBottom: '10px' }}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '20px', border: '1px solid #eee', padding: '5px' }}
                />
                
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 5px', color: '#1d3557' }}>{item.title}</h4>
                  <small style={{ color: '#888' }}>ID: {item.id}</small>
                </div>

                {/* Kiểm soát số lượng */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '30px' }}>
                    <button 
                        onClick={() => handleQuantityChange(item.id, -1)} 
                        style={{ padding: '5px 10px', background: '#f8f9fa', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '3px' }}
                    >
                        -
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button 
                        onClick={() => handleQuantityChange(item.id, 1)} 
                        style={{ padding: '5px 10px', background: '#f8f9fa', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '3px' }}
                    >
                        +
                    </button>
                </div>
                
                {/* Giá và Tổng giá mặt hàng */}
                <div style={{ minWidth: '150px', textAlign: 'right', marginRight: '20px' }}>
                    <p style={{ margin: '0', fontSize: '1.1rem', color: '#e63946', fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <small style={{ color: '#555' }}>
                        (${item.price} / cái)
                    </small>
                </div>
                
                {/* Nút xóa */}
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.4rem', marginLeft: '10px' }}
                >
                  &times; {/* Dấu X lớn */}
                </button>
              </div>
            ))}
          </div>
          
          {/* TỔNG KẾT */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #1d3557', paddingTop: '20px', marginTop: '30px', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 'normal' }}>Tổng tiền thanh toán: </h3>
              <h3 style={{ margin: '0 0 0 25px', color: '#e63946', fontSize: '1.8rem' }}>${totalAmount.toFixed(2)}</h3>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '25px' }}>
            <button 
              onClick={() => alert('Chức năng thanh toán đang được phát triển!')}
              style={{ padding: '15px 35px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              Tiến hành Thanh toán
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;