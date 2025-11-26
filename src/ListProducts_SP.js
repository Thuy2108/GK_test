import React, { useState, useEffect } from "react";
// Thêm useOutletContext để nhận hàm updateCartCount từ Layout
import { useNavigate, useOutletContext } from "react-router-dom"; 
import { supabase } from "./supabaseClient";

// --- Hàm tiện ích Giỏ hàng ---
const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};
// -----------------------------

const ListProducts_SP = () => {
  const [listProduct, setListProduct] = useState([]);
  // Không cần state 'cart' ở đây nữa, vì chúng ta dùng localStorage trực tiếp
  const navigate = useNavigate();
  
  // Lấy hàm cập nhật số lượng từ Layout
  // Nếu Layout đã được sửa đúng, updateCartCount sẽ có giá trị
  const { updateCartCount } = useOutletContext(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("product1")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        setListProduct(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err.message);
      }
    };
    fetchProducts();

    // 1. Cập nhật số lượng giỏ hàng trên header khi component tải
    const storedCart = getCartFromLocalStorage();
    if (updateCartCount) {
        updateCartCount(storedCart.length);
    }
  }, [updateCartCount]); // Thêm updateCartCount vào dependency list

  // --- LOGIC THÊM VÀO GIỎ HÀNG (MỚI) ---
  const addToCart = (product) => {
    let currentCart = getCartFromLocalStorage();
    
    // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Nếu đã có, tăng số lượng
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Nếu chưa có, thêm mới với trường 'quantity'
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
      <h2 style={{ marginBottom: "20px" }}>Danh sách sản phẩm</h2>

      {/* GRID SẢN PHẨM */}
      <div
        style={{
          display: "grid",
          // Thay thế giá trị cũ bằng "repeat(3, 1fr)"
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "20px",
        }}
      >
        {listProduct.map((p) => (
          <div
            key={p.id}
            // Giữ nguyên các style và hiệu ứng hover
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "12px",
              textAlign: "center",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 8px 18px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            {/* ... (Phần hiển thị hình ảnh và thông tin sản phẩm giữ nguyên) ... */}
            <div
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/sanpham/${p.id}`)}
            >
              <img
                src={p.image}
                alt={p.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.35s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>

            <h4 style={{ margin: "10px 0 5px", fontSize: "1rem" }}>
              {p.title}
            </h4>

            <p style={{ color: "#e63946", fontWeight: "bold", margin: "0" }}>
              ${p.price}
            </p>

            <small style={{ color: "#555" }}>
              ⭐ {p.rating_rate} | ({p.rating_count} đánh giá)
            </small>

            {/* Nút thêm giỏ hàng */}
            <button
              onClick={() => addToCart(p)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "9px",
                border: "none",
                borderRadius: "6px",
                background: "#1d3557",
                color: "white",
                cursor: "pointer",
                transition: "0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#457b9d";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1d3557";
                e.currentTarget.style.transform = "scale(1)";
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

export default ListProducts_SP;