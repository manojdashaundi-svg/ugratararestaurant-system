console.log("script.js loaded");

document.getElementById("loadMenu").addEventListener("click", loadMenu);

async function loadMenu() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);

    document.getElementById("menu").innerHTML =
      "<p style='color:red'>Menu Load Failed</p>";
    return;
  }

  let html = "";

  data.forEach(item => {
    html += `
      <div style="border:1px solid #ddd;padding:15px;margin:10px;border-radius:10px;">
        <h3>${item.name}</h3>
        <p>${item.description ?? ""}</p>
        <h4>RM ${item.price}</h4>
      </div>
    `;
  });

  document.getElementById("menu").innerHTML = html;
}
