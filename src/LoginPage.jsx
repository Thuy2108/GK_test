import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import anhlogo1 from "./assets/images/keylogin.png";
import "./assets/css/login.css";
import { supabase } from "./supabaseClient";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 👉 Hàm băm SHA-256
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Băm mật khẩu nhập vào
      const hashedPassword = await hashPassword(password);

      // 2️⃣ Lấy user theo username
      const { data, error } = await supabase
        .from("tbl_user")
        .select("*")
        .eq("username", username)
        .single();

      // 3️⃣ Kiểm tra lỗi hoặc không có user
      if (error || !data) {
        alert("❌ Sai tài khoản hoặc mật khẩu!");
        setLoading(false);
        return;
      }

      // 4️⃣ So sánh hash
      if (data.password_hash === hashedPassword) {
        localStorage.setItem("user", JSON.stringify(data));
        alert("✅ Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("❌ Sai tài khoản hoặc mật khẩu!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi kết nối Supabase!");
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={anhlogo1} alt="Logo" className="login-logo" />

        <h2 className="login-title">Đăng nhập vào tài khoản</h2>
        <p className="login-subtitle">Sử dụng tài khoản của bạn để tiếp tục</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="register-link">
          Bạn chưa có tài khoản? <a href="#">Tạo tài khoản mới</a>
        </p>

        <div className="social-login">
          <button className="social-btn google">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png"
              alt="Google"
            />
            <span>Đăng nhập Google</span>
          </button>

          <button className="social-btn facebook">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
            />
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
