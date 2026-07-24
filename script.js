console.log("script.js loaded");

// ग्लोबल भेरिएबलहरू
window.cart = [];
window.globalMenuData = [];
window.selectedCategory = "All";

// पेज लोड हुनेबित्तिकै मेनु लोड गर्ने
document.addEventListener("DOMContentLoaded", function () {
    loadMenu();
});

async function loadMenu() {
    console.log("Loading menu...");

    const { data, error } = await supabase
        .from("menu_items")
        .select("*");

    console.log("Data:", data);
    console.log("Error:", error);

    if (error) {
        document.getElementById("menu").innerHTML =
            "<pre>" + JSON.stringify(error, null, 2) + "</pre>";
        return;
    }

    if (!data || data.length === 0) {
        document.getElementById("menu").innerHTML =
            "<h3>No menu items found.</h3>";
        return;
    }

    window.globalMenuData = data;
    renderMenu(data);
}

// मेनुलाई स्क्रीनमा देखाउने फंक्सन
function renderMenu(data) {
    let html = "";

    data.forEach(item => {
        const itemName = item.name || "Unnamed Item";
        const itemPrice = parseFloat(item.price) || 0;
        const itemDesc = item.description || "";
        const itemCategory = item.category || "All";
        const itemImg = item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";

        html += `
            <div class="food-card" data-category="${itemCategory}" style="background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 3px 10px rgba(0,0,0,0.05); padding:12px; text-align:center;">
                <img src="${itemImg}" alt="${itemName}" style="width:100%; height:140px; object-fit:cover; border-radius:8px;">
                <h3 style="font-size:18px; margin:10px 0 5px 0;">${itemName}</h3>
                <p style="font-size:13px; color:#666; margin-bottom:10px;">${itemDesc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                    <strong style="color:#e91e63; font-size:18px;">RM ${itemPrice}</strong>
                    <button onclick="window.addToCart('${itemName}', ${itemPrice})" style="background:#e91e63; color:#fff; border:none; padding:8px 14px; border-radius:8px; font-weight:bold; cursor:pointer;">🛒 Add</button>
                </div>
            </div>
        `;
    });

    document.getElementById("menu").innerHTML = html;
}

// क्याटेगोरी फिल्टर गर्ने
window.filterCategory = function(category, element) {
    window.selectedCategory = category;
    
    // बटनको रङ बदल्ने
    const buttons = document.querySelectorAll(".category-tabs button");
    buttons.forEach(btn => {
        btn.style.background = "#fff";
        btn.style.color = "#333";
    });
    if(element) {
        element.style.background = "#e91e63";
        element.style.color = "#fff";
    }

    window.searchFood();
};

// सर्च र क्याटेगोरी दुवै मिलाएर परिकार खोज्ने
window.searchFood = function() {
    const keyword = document.getElementById("searchFood").value.toLowerCase();
    const cards = document.querySelectorAll(".food-card");

    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        const category = card.dataset.category ? card.dataset.category.trim() : "";

        const matchesCategory = (window.selectedCategory === "All" || category.toLowerCase() === window.selectedCategory.toLowerCase());
        const matchesKeyword = title.includes(keyword);

        if (matchesCategory && matchesKeyword) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};

// कार्टमा आइटम थप्ने
window.addToCart = function(food, price) {
    const found = window.cart.find(item => item.food === food);
    if (found) {
        found.qty++;
    } else {
        window.cart.push({ food, price: Number(price), qty: 1 });
    }
    window.showCart();
};

// कार्टको हिसाब देखाउने
window.showCart = function() {
    let html = "";
    let subtotal = 0;

    if (window.cart.length === 0) {
        html = "<p>Cart is empty.</p>";
    } else {
        window.cart.forEach((item, i) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:15px;">
                    <span><b>${item.food}</b> (x${item.qty})</span>
                    <span>RM ${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
    }

    document.getElementById("cart").innerHTML = html;
    document.getElementById("total").innerText = subtotal.toFixed(2);
};
