// ===============================
// GIỎ HÀNG - SCRIPT.JS (CẬP NHẬT: PHÂN BIỆT NÚT Ở PRODUCTS & GỌI MÓN)
// ===============================

let cart = [];
// ====== Cập nhật giao diện giỏ hàng (floating cart) ======
function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (cartCount) cartCount.textContent = cart.length;
  if (cartItems) cartItems.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    if (!cartItems) return;

    const li = document.createElement("li");

    const nameEl = document.createElement("span");
    nameEl.classList.add("item-name");
    nameEl.textContent = item.name;

    const priceEl = document.createElement("span");
    priceEl.classList.add("item-price");
    priceEl.textContent = item.price.toLocaleString("vi-VN") + " VNĐ";

    const delBtn = document.createElement("button");
    delBtn.classList.add("remove-item");
    delBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
    delBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCartUI();
      saveCartToLocal();
    });

    li.appendChild(nameEl);
    li.appendChild(priceEl);
    li.appendChild(delBtn);
    cartItems.appendChild(li);

    total += item.price;
  });

  if (cartTotal) cartTotal.textContent = total.toLocaleString("vi-VN");
}

// ====== Lưu / tải giỏ hàng ======
function saveCartToLocal() {
  localStorage.setItem("cartData", JSON.stringify(cart));
}

function loadCartFromLocal() {
  const data = localStorage.getItem("cartData");
  if (data) {
    cart = JSON.parse(data);
    updateCartUI();
  }
}

// ====== Gắn sự kiện Add to Cart ======
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    if (!productCard) return;

    const name = productCard.querySelector(".product-title").textContent.trim();
    const priceText = productCard
      .querySelector(".product-price")
      .textContent.replace(/[^0-9.]/g, "")
      .trim();
    const price = parseFloat(priceText) * 1000;

    cart.push({ name, price });
    updateCartUI();
    saveCartToLocal();

    // Hiệu ứng "Đã thêm!"
    btn.textContent = "Đã thêm!";
    btn.style.backgroundColor = "#4CAF50";
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
      btn.style.backgroundColor = "";
    }, 1000);
  });
});

// ====== Xóa toàn bộ giỏ hàng ======
const clearCartBtn = document.getElementById("clear-cart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
    saveCartToLocal();
  });
}

// ====== Ẩn / Hiện giỏ hàng nổi ======
const toggleCart = document.getElementById("toggle-cart");
const cartBody = document.getElementById("cart-body");
if (toggleCart && cartBody) {
  toggleCart.addEventListener("click", () => {
    cartBody.classList.toggle("hidden");
    toggleCart.classList.toggle("rotate");
  });
}

// ====== Phân biệt theo trang hiện tại ======
window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  loadCartFromLocal();

  if (path.includes("products.html")) {
    const confirmBtn = document.getElementById("confirm-order");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          alert("Giỏ hàng trống! Vui lòng chọn món trước khi xác nhận.");
          return;
        }

        saveCartToLocal();
        window.location.href = "dine-in-oder.html";
      });
    }
  }
  // Nút "Đặt hàng online"
  const onlineBtn = document.getElementById("order-online");
  if (onlineBtn) {
    onlineBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Giỏ hàng trống! Vui lòng chọn món trước khi đặt hàng.");
        return;
      }
      saveCartToLocal();
      window.location.href = "online.html";
    });
  }

  if (path.includes("dine-in-oder.html")) {
    const orderedList = document.getElementById("ordered-items");
    const orderTotal = document.getElementById("order-total");
    const confirmOrderBtn = document.getElementById("confirm-order");

    const data = localStorage.getItem("cartData");
    if (data && orderedList && orderTotal) {
      const items = JSON.parse(data);
      orderedList.innerHTML = "";
      let total = 0;

      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price.toLocaleString(
          "vi-VN"
        )} VNĐ`;
        orderedList.appendChild(li);
        total += item.price;
      });

      orderTotal.textContent = total.toLocaleString("vi-VN") + " VNĐ";
    }

    // Khi xác nhận gọi món ở đây → chỉ hiện thông báo
    if (confirmOrderBtn) {
      confirmOrderBtn.addEventListener("click", () => {
        alert("Gọi món thành công! Cảm ơn bạn đã gọi món ☕");
        localStorage.removeItem("cartData");
        window.location.href = "index.html";
      });
    }
  }
  // ===============================
  // TRANG ONLINE.HTML - ĐẶT HÀNG TRỰC TUYẾN
  // ===============================
  if (window.location.pathname.includes("online.html")) {
    const orderedList = document.getElementById("ordered-items");
    const subtotalEl = document.getElementById("subtotal");
    const shippingFeeEl = document.getElementById("shipping-fee");
    const totalEl = document.getElementById("order-total");
    const confirmOrderBtn = document.querySelector(".submit-btn");
    const data = localStorage.getItem("cartData");

    if (data && orderedList && subtotalEl && totalEl) {
      const items = JSON.parse(data);
      orderedList.innerHTML = "";
      let subtotal = 0;
      const shippingFee = 15000;

      // Hiển thị từng món đã đặt
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent =
          `${item.name} - ` + item.price.toLocaleString("vi-VN") + " VNĐ";
        orderedList.appendChild(li);
        subtotal += item.price;
      });

      // Tính tổng
      subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + " VNĐ";
      shippingFeeEl.textContent = shippingFee.toLocaleString("vi-VN") + " VNĐ";
      const total = subtotal + shippingFee;
      totalEl.textContent = total.toLocaleString("vi-VN") + " VNĐ";
    }

    // Khi xác nhận đặt hàng
    if (confirmOrderBtn) {
      confirmOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const name = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();

        if (!name || !phone || !address) {
          alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
          return;
        }

        alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng ☕");
        localStorage.removeItem("cartData");
        window.location.href = "index.html"; // về trang chính sau khi đặt
      });
    }
  }
});
// ====== Gửi form thanh toán (checkout.html) ======
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email || !address || !phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng ☕");
    localStorage.removeItem("cartData");
    checkoutForm.reset();
    window.location.href = "index.html";
  });
}
// ===============================
// LOGIN BASIC
// ===============================
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      alert("Chưa có tài khoản nào được đăng ký!");
      return;
    }

    if (username === userData.username && password === userData.password) {
      alert(`Đăng nhập thành công! Xin chào ${username} ☕`);
      localStorage.setItem("loggedInUser", username);
      window.location.href = "index.html";
    } else {
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  });
}
// ===============================
// REGISTER BASIC
// ===============================
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;

    if (password !== confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Lưu thông tin người dùng vào localStorage
    const userData = { username, email, password };
    localStorage.setItem("userData", JSON.stringify(userData));

    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
    window.location.href = "login.html";
  });
}
// ===============================
// NAVBAR TOGGLE HIỆU ỨNG 3 GẠCH (CHUẨN TOÀN TRANG)
// ===============================

// Đảm bảo code chạy sau khi DOM tải xong
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (!navToggle || !navMenu) return;

  // Khi bấm nút 3 gạch
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));

    // Thêm / bỏ class 'active' để xoay icon
    navToggle.classList.toggle("active");

    // Mở / đóng menu
    navMenu.classList.toggle("nav-open");
  });

  // Khi click vào 1 link → đóng menu
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("nav-open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
});
