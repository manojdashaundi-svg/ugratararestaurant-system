console.log("script.js loaded");

window.cart = []; 
window.selectedCategory = "All";
window.base64SlipData = ""; 

// पेज लोड हुनेबित्तिकै मेनु लोड गर्ने
document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
});

// Supabase बाट मेनु लोड गर्ने फंक्सन
async function loadMenu() {
    console.log("Loading menu...");

    const { data, error } = await window.supabaseClient
        .from("menu_items")
        .select("*");

    if (error) {
        console.error("Error loading menu:", error);
        document.getElementById("menu").innerHTML = "<p style='color:red; text-align:center;'>⚠️ Error loading menu items!</p>";
        return;
    }

    if (!data || data.length === 0) {
        document.getElementById("menu").innerHTML = "<p style='text-align:center;'>No menu items found.</p>";
        return;
    }

    window.globalMenuData = data;
    showMenu(data);
}

// मेनुलाई स्क्रिनमा देखाउने
window.showMenu = function(data) {
    let html = "";
    data.forEach(item => {
        const itemName = item.name || "Unnamed Item";
        const itemPrice = parseFloat(item.price) || 0;
        const itemDesc = item.description || "";
        const itemCategory = item.category || "All";
        const imgUrl = item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
        const stockStatus = item.status || "In Stock";

        let orderActionHtml = `<button onclick="window.addToCart('${itemName.replace(/'/g, "\\'")}', ${itemPrice})">🛒 Add</button>`;
        if (stockStatus === "Out of Stock") {
            orderActionHtml = `<button disabled style="background:#ccc; color:#777; cursor:not-allowed;">🚫 Out of Stock</button>`;
        }

        html += `
            <div class="food-card" data-category="${itemCategory}">
                <img src="${imgUrl}" alt="${itemName}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'">
                <div class="food-info">
                    <h3>${itemName}</h3>
                    <div class="rating">⭐⭐⭐⭐⭐ (4.9)</div>
                    <p class="food-desc">${itemDesc}</p>
                    <div class="food-bottom">
                        <span class="food-price">RM ${itemPrice.toFixed(2)}</span>
                        ${orderActionHtml}
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById("menu").innerHTML = html;
    window.searchFood();
};

window.filterCategory = function(category, element) {
    window.selectedCategory = category;
    document.querySelectorAll(".category-tabs button").forEach(btn => btn.classList.remove("active"));
    if(element) { element.classList.add("active"); }
    window.searchFood();
};

window.searchFood = function() {
    const keyword = document.getElementById("searchFood").value.toLowerCase();
    const cards = document.querySelectorAll(".food-card");
    cards.forEach(card => {
        const h3El = card.querySelector("h3");
        const food = h3El ? h3El.innerText.toLowerCase() : "";
        const category = card.dataset.category ? card.dataset.category.trim() : "";
        card.style.display = ((window.selectedCategory === "All" || category.toLowerCase() === window.selectedCategory.toLowerCase()) && food.includes(keyword)) ? "block" : "none";
    });
};

window.addToCart = function(food, price) {
    const found = window.cart.find(item => item.food === food);
    if(found) { 
        found.qty++; 
    } else { 
        window.cart.push({ food, price: Number(price), qty: 1 }); 
    } 
    window.showCart();
};

window.increaseQty = function(i) { window.cart[i].qty++; window.showCart(); };
window.decreaseQty = function(i) { 
    if(window.cart[i].qty > 1) { 
        window.cart[i].qty--; 
    } else { 
        window.cart.splice(i, 1); 
    } 
    window.showCart(); 
};
window.removeItem = function(i) { window.cart.splice(i, 1); window.showCart(); };

window.showCart = function() {
    let html = ""; 
    let subtotal = 0; 
    
    if(window.cart.length === 0) { 
        html = "<p style='padding:0 5px;'>Your cart is empty.</p>"; 
    } else {
        window.cart.forEach((item, i) => { 
            const itemTotal = item.price * item.qty; 
            subtotal += itemTotal; 
            html += `<div style='padding: 0 5px;'><p><b>${item.food}</b><br><button class="qty-btn" style='padding:5px 12px; font-size:13px;' onclick="window.decreaseQty(${i})">−</button> <span style='margin:0 10px;font-weight:bold;'>${item.qty}</span> <button class="qty-btn" style='padding:5px 12px; font-size:13px;' onclick="window.increaseQty(${i})">+</button> &nbsp;&nbsp; RM ${itemTotal.toFixed(2)} <button onclick="window.removeItem(${i})" style="background:red;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;margin-left:10px;">✕</button></p></div><hr style="margin:10px 0; border:0; border-top:1px dashed #ccc;">`; 
        });
    }
    
    let zoneSelect = document.getElementById("deliveryZoneSelect");
    let deliveryCharge = zoneSelect ? parseFloat(zoneSelect.value) : 0;
    let grandTotal = subtotal + deliveryCharge;
    
    document.getElementById("cart").innerHTML = html; 
    if(document.getElementById("subtotalPrice")) document.getElementById("subtotalPrice").innerText = subtotal.toFixed(2);
    if(document.getElementById("deliveryPriceLabel")) document.getElementById("deliveryPriceLabel").innerText = deliveryCharge.toFixed(2);
    document.getElementById("total").innerText = grandTotal.toFixed(2); 
    document.getElementById("cartCount").innerText = window.cart.reduce((sum, item) => sum + item.qty, 0);
};

window.openCart = function() {
    var el = document.querySelector(".customer"); 
    if(el) el.scrollIntoView({ behavior: "smooth" });
};

window.previewFile = function() { 
    const file = document.getElementById("paymentSlipFile").files[0]; 
    const status = document.getElementById("fileStatus"); 
    if (!file) return; 
    status.innerText = "Processing Image..."; 
    const reader = new FileReader(); 
    reader.onloadend = function() { 
        window.base64SlipData = reader.result; 
        status.innerText = "📸 Slip Attached Successfully!"; 
    }; 
    reader.readAsDataURL(file); 
};

// Supabase मा अर्डर सेभ गर्ने फंक्सन
window.placeOrder = async function() {
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const orderBtn = document.getElementById("submitOrderBtn");
    
    let zoneSelect = document.getElementById("deliveryZoneSelect");
    let zoneName = zoneSelect ? zoneSelect.options[zoneSelect.selectedIndex].dataset.name : "Dine In";
    let deliveryCharge = zoneSelect ? parseFloat(zoneSelect.value) : 0;
    
    if(name === "" || phone === "" || window.cart.length === 0 || window.base64SlipData === "") {
        alert("Please fill in all details and upload payment slip."); 
        return; 
    }
    
    orderBtn.disabled = true;
    orderBtn.innerText = "Placing Order...";
    
    const itemsText = window.cart.map(item => `${item.food} x ${item.qty} (RM ${item.price * item.qty})`).join("\n");
    const subtotal = window.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const grandTotal = subtotal + deliveryCharge;
    
    const orderNo = "ORD" + Math.floor(1000 + Math.random() * 9000);

    const { data, error } = await window.supabaseClient
        .from("orders")
        .insert([
            {
                order_no: orderNo,
                customer_name: name,
                phone: phone,
                address: `[${zoneName}] ${address}`,
                items: itemsText,
                total: grandTotal.toFixed(2),
                status: "Order Received",
                payment_slip: window.base64SlipData
            }
        ]);

    orderBtn.disabled = false;
    orderBtn.innerText = "🚀 Place Order";

    if (error) {
        alert("Error saving order: " + error.message);
        console.error(error);
        return;
    }

    alert("✅ Order Placed Successfully! Order No: " + orderNo);
    
    const whatsappMsg = `🛒 NEW ORDER (QR PAID)\n\nOrder No: ${orderNo}\n\n👤 ${name}\n📞 ${phone}\n🚚 Zone: ${zoneName}\n🏠 Address: ${address}\n\n🍽 Items:\n${itemsText}\n\n------------------\nSubtotal: RM ${subtotal.toFixed(2)}\nDelivery: RM ${deliveryCharge.toFixed(2)}\n💰 Total: RM ${grandTotal.toFixed(2)}`;
    window.open("https://wa.me/601165531782?text=" + encodeURIComponent(whatsappMsg), "_blank");

    window.cart = []; 
    window.showCart(); 
    document.getElementById("customerName").value = ""; 
    document.getElementById("customerPhone").value = ""; 
    document.getElementById("customerAddress").value = ""; 
    document.getElementById("paymentSlipFile").value = ""; 
    document.getElementById("fileStatus").innerText = ""; 
    window.base64SlipData = "";
    if(zoneSelect) zoneSelect.value = "0";
};

// अर्डर ट्र्याक गर्ने फंक्सन
window.trackMyOrder = async function() {
    const orderNo = document.getElementById("trackOrderNo").value.trim().toUpperCase(); 
    if (orderNo === "") return; 
    
    document.getElementById("trackResult").innerHTML = "Searching..."; 

    const { data, error } = await window.supabaseClient
        .from("orders")
        .select("*")
        .eq("order_no", orderNo)
        .single();

    if (error || !data) {
        document.getElementById("trackResult").innerHTML = `<div style="color:red;padding:15px;background:#fff;border-radius:8px;font-weight:bold;margin-top:10px;">❌ Order Not Found</div>`;
        return;
    }

    let s = data.status || "Pending";
    let progress = 25, color = "#FF9800";
    if(s === "Preparing"){ progress = 50; color = "#2196F3"; }
    else if(s === "Ready"){ progress = 75; color = "#9C27B0"; }
    else if(s === "Out for Delivery"){ progress = 90; color = "#00BCD4"; }
    else if(s === "Delivered"){ progress = 100; color = "#4CAF50"; }

    document.getElementById("trackResult").innerHTML = `
        <div style="background:#fff; padding:22px; border-radius:18px; box-shadow:0 5px 18px rgba(0,0,0,.08); line-height:1.8; margin-top:15px; text-align:left; color:#333;">
            <center><h3 style="color:#e91e63; margin-bottom:15px;">📦 Order Tracking</h3></center>
            <p><b>Order No :</b> ${data.order_no}</p>
            <p><b>Status :</b> <span style="background:${color}; color:white; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:14px;">${s}</span></p>
            <div style="width:100%; height:18px; background:#eee; border-radius:10px; overflow:hidden; margin:12px 0;"><div style="width:${progress}%; height:100%; background:${color}; text-align:center; color:white; font-size:12px; font-weight:bold; line-height:18px;">${progress}%</div></div>
            <p><b>Items:</b><br><pre style="font-family:Arial; white-space:pre-wrap;">${data.items}</pre></p>
            <p><b>Total Amount:</b> RM ${data.total}</p>
        </div>
    `;
};
