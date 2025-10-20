let cart = [];

// Hàm cập nhật giỏ hàng
function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  cartCount.textContent = cart.length;
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");

    // Tên sản phẩm
    const nameEl = document.createElement("span");
    nameEl.classList.add("item-name");
    nameEl.textContent = item.name;

    // Giá sản phẩm
    const priceEl = document.createElement("span");
    priceEl.classList.add("item-price");
    priceEl.textContent = `$${item.price.toFixed(2)}`;

    // Nút xóa sản phẩm
    const delBtn = document.createElement("button");
    delBtn.classList.add("remove-item");
    delBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
    delBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCartUI();
    });

    li.appendChild(nameEl);
    li.appendChild(priceEl);
    li.appendChild(delBtn);
    cartItems.appendChild(li);

    total += item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// Gắn sự kiện Add to Cart đúng cách
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");

    if (!productCard) return;

    const name = productCard.querySelector(".product-title").textContent.trim();
    const priceText = productCard
      .querySelector(".product-price")
      .textContent.replace("$", "")
      .trim();
    const price = parseFloat(priceText);

    cart.push({ name, price });
    updateCartUI();

    // Hiệu ứng "Added!"
    btn.textContent = "Added!";
    btn.style.backgroundColor = "#4CAF50";
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
      btn.style.backgroundColor = "";
    }, 1000);
  });
});

// Xóa toàn bộ giỏ hàng
const clearCartBtn = document.getElementById("clear-cart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
  });
}

// Mở / đóng giỏ hàng
const toggleCart = document.getElementById("toggle-cart");
const cartBody = document.getElementById("cart-body");

if (toggleCart) {
  toggleCart.addEventListener("click", () => {
    cartBody.classList.toggle("hidden");
    toggleCart.classList.toggle("rotate");
  });
}
// ===== Lưu giỏ hàng vào localStorage =====
function saveCartToLocal() {
  localStorage.setItem("cartData", JSON.stringify(cart));
}

function loadCartFromLocal() {
  const data = localStorage.getItem("cartData");
  if (data) cart = JSON.parse(data);
}

// Nút Thanh toán ở products.html
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    saveCartToLocal();
  });
}

// ===== Nếu người dùng nhấn "Thanh Toán" ở trang chủ =====
const goCheckout = document.getElementById("go-checkout");
if (goCheckout) {
  goCheckout.addEventListener("click", () => {
    saveCartToLocal(); // lưu giỏ hàng (nếu có)
    window.location.href = "checkout.html"; // chuyển trang
  });
}

// ===== Hiển thị giỏ hàng ở checkout.html =====
const orderSummary = document.getElementById("order-summary");
const checkoutTotal = document.getElementById("checkout-total");

if (orderSummary && checkoutTotal) {
  loadCartFromLocal();
  let total = 0;
  orderSummary.innerHTML = "";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span><span>$${item.price.toFixed(
      2
    )}</span>`;
    orderSummary.appendChild(li);
    total += item.price;
  });

  checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// ===== Gửi form thanh toán =====
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
