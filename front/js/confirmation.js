const link = window.location.href;
const url = new URL(link);
const id = url.searchParams.get("id");


document.getElementById('orderId').textContent = id