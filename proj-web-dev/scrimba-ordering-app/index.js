import { menu } from "./menu.js";

let order = JSON.parse(localStorage.getItem("order")) ?? {};

//only needs to execute once
document.getElementById("menu").innerHTML = renderMenu();
renderOrder();

document.addEventListener("click", (event) => {
  if (event.target.dataset.add) {
    addItemToOrder(event.target.dataset.add);
  } else if (event.target.dataset.remove) {
    removeItemFromOrder(event.target.dataset.remove);
  } else if (
    event.target.classList.contains("place-order")
  ) {
    document
      .querySelector(".modal")
      .classList.remove("hidden");
  }
});

document
  .getElementById("payment-details")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    document
      .querySelector(".modal")
      .classList.add("hidden");
    const data = new FormData(e.target);
    renderOrder(data.get("full-name"), data.get("email"));
    document
      .querySelectorAll("button")
      .forEach((button) => {
        button.classList.add("hidden");
      });
    localStorage.removeItem("order");
  });

function renderMenu() {
  return menu
    .map((item) => {
      return `<li class="menu-item">
                <img class="menu-item-img" src="${item.image}" alt="">
                <div class="menu-item-text">
                    <h2 class="menu-item-name">${item.name}</h2>
                    <p class="menu-item-ingredients">${item.ingredients.join(", ")}</p>
                    <p class="menu-item-price">$${item.price}</p>
                </div>
                <button class="add-menu-item" data-add=${item.id}>
                    <i class="ph ph-plus" data-add=${item.id}></i>
                </button>
            </li>`;
    })
    .join("");
}

function addItemToOrder(itemId) {
  menu.find((x) => x.id == itemId) && order[itemId]
    ? order[itemId]++
    : (order[itemId] = 1);

  localStorage.setItem("order", JSON.stringify(order));
  renderOrder();
}

function removeItemFromOrder(itemId) {
  order[itemId] === 1
    ? delete order[itemId]
    : order[itemId]--;
  localStorage.setItem("order", JSON.stringify(order));
  renderOrder();
}

function renderOrder(customer = null, email = null) {
  let orderHtml =
    customer && email
      ? `<div class="receipt">
            <h2 class="your-order">Order #${Math.ceil(Math.random() * 100)}</h2>
            <p class="small-text">CUSTOMER: ${customer}</p>
            <p class="small-text">EMAIL: ${email}</p>
        <table>`
      : `<div class="receipt"><table>`;

  let totalPrice = 0;
  Object.keys(order).forEach((menuItemId) => {
    const quantity = order[menuItemId];
    if (quantity > 0) {
      const menuItem = menu.find((x) => x.id == menuItemId);
      const menuItemPrice = menuItem.price * quantity;

      totalPrice += menuItemPrice;
      orderHtml += `<tr class="order-item">
                        <td><p>${quantity}</p></td>
                        <td><p>${menuItem.name}</p></td>
                                                <td><button class="remove-menu-item" data-remove=${menuItemId}>-</button></td>

                        <td class="price"><p class="price">$${menuItemPrice}</p></tr></td>`;
    }
  });

  const salesTax =
    Math.round((totalPrice * 0.07) / 0.01) / 100;
  totalPrice += salesTax;

  orderHtml +=
    `</table>` +
    (Object.keys(order).length === 0
      ? ""
      : `<div class="order-item tax">
            <p>Sales Tax</p>
            <p class="price">$${salesTax}</p>
          </div>`) +
    `<div class="order-item total">
            <h3>Total: </h3>
            <h3 class="price">$${totalPrice}</h3>
        </div>`;
  orderHtml +=
    customer && email
      ? `<h3 class="center thank-you">THANK YOU</h3>`
      : "";
  orderHtml += `</div>
    <button class="place-order">Place Order</button>`;

  document.getElementById("order").innerHTML = orderHtml;
}
