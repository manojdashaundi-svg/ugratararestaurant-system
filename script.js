console.log("script.js loaded");

document.getElementById("loadMenu").addEventListener("click", loadMenu);

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

  let html = "";

  data.forEach(item => {
    html += `
      <div style="border:1px solid #ddd;padding:15px;margin:10px;">
        <h3>${item.name}</h3>
        <p>${item.description || ""}</p>
        <strong>RM ${item.price}</strong>
      </div>
    `;
  });

  document.getElementById("menu").innerHTML = html;
}
