import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import "./assets/css/quanlysp.css";

const EditProduct = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    rating_rate: "",
    rating_count: "",
    // Thêm các trường khác nếu có, ví dụ: description
  });
  // Thêm state để kiểm tra lỗi tải dữ liệu
  const [loading, setLoading] = useState(!isNew);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (isNew) return; // Không cần tải nếu là thêm mới

    const fetchProduct = async () => {
      setLoading(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from("product1")
        .select("*")
        .eq("id", id)
        .single();

      setLoading(false);

      if (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        // Hiển thị lỗi rõ ràng hơn cho người dùng
        setFetchError(
          "Không thể tải thông tin sản phẩm. Vui lòng kiểm tra RLS hoặc ID."
        );
        // Thiết lập state product thành rỗng nếu lỗi
        setProduct({});
      } else if (data) {
        // ✅ Dữ liệu tải thành công
        setProduct(data);
      } else {
        // Dữ liệu null nhưng không có lỗi Supabase (ví dụ: không tìm thấy)
        setFetchError(`Không tìm thấy sản phẩm có ID: ${id}`);
        setProduct({});
      }
    };

    fetchProduct();
  }, [id, isNew]);

  // ... (Hàm handleChange và handleSubmit giữ nguyên) ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (logic handleSubmit giữ nguyên) ...
    if (isNew) {
      const { error } = await supabase.from("product1").insert([product]);
      if (error) return alert("Lỗi thêm: " + error.message);
      alert("✅ Đã thêm sản phẩm!");
    } else {
      const { error } = await supabase
        .from("product1")
        .update(product)
        .eq("id", id);
      if (error) return alert("Lỗi cập nhật: " + error.message);
      alert("✅ Đã cập nhật sản phẩm!");
    }
    navigate("/admin/products");
  };

  // --- HIỂN THỊ UI ---

  if (loading) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", marginTop: "50px", color: "red" }}
      >
        <h3>Lỗi tải dữ liệu</h3>
        <p>{fetchError}</p>
        <button onClick={() => navigate("/admin/products")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <h2>{isNew ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}</h2>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="form">
            {/* ... (Các thẻ label và input giữ nguyên) ... */}
            <label>
              Tên sản phẩm:
              <input
                type="text"
                name="title"
                value={product.title || ""} // Đảm bảo không phải null
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Giá:
              <input
                type="number"
                name="price"
                value={product.price || ""} // Đảm bảo không phải null
                onChange={handleChange}
                required
              />
            </label>

            {/* ... các input khác ... */}
            <label>
              Hình ảnh (URL):
              <input
                type="text"
                name="image"
                value={product.image || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Đánh giá (0–5):
              <input
                type="number"
                step="0.1"
                name="rating_rate"
                value={product.rating_rate || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Số lượt đánh giá:
              <input
                type="number"
                name="rating_count"
                value={product.rating_count || ""}
                onChange={handleChange}
              />
            </label>

            <div className="actions">
              <button
                type="button"
                className="btn gray"
                onClick={() => navigate("/admin/products")}
              >
                Hủy
              </button>
              <button type="submit" className="btn blue">
                {isNew ? "Thêm" : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
