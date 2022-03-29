//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const purchaseCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".center-products");
const filterOverlay = document.querySelector(".filter-overlay");
const filterDOM = document.querySelector(".filter");
const filterBtn = document.querySelector(".filter-btn");
const closeFilterBtn = document.querySelector(".close-filter");
const searchInput = document.getElementById("search");
const panel = document.getElementById("panel");
const panelChild = document.querySelector(".panel-child");
const alfaFilter = document.querySelector(".alfa-filter");
const betaFilter = document.querySelector(".beta-filter");
const productClicked = document.querySelectorAll(".product");
const detailsOverlay = document.querySelector("details-overlay");
const detailsDOM = document.querySelector(".details");

// filter by searchbar
const searchHandler = e => {
  const input = e.target.value;
  input === "" ? togglePanel(false) : togglePanel(true);
  //console.log(this.productsInMemory);
  const prod = this.productsInMemory.filter(product => {
    return product.title.toLowerCase().includes(input.toLowerCase());
  });
  console.log(prod);
  new UI().showPanelProducts(prod);
  //new UI().displayProdcuts(prod);
};

const togglePanel = isOpen => {
  if (isOpen) panel.style.visibility = "visible";
  else panel.style.visibility = "hidden";
};

const filterAlfa = () => {
  this.productsInMemory = this.productsInMemory.sort((a, b) =>
    a.title.toLowerCase() > b.title.toLowerCase()
      ? 1
      : b.title.toLowerCase() > a.title.toLowerCase()
      ? -1
      : 0
  );
  new UI().displayProdcuts(this.productsInMemory);
};

const displayClickedProduct = e => {
  let click = e.target.value;

  console.log(click);
};

productClicked.forEach(element => {
  element.addEventListener("click", displayClickedProduct);
});

const filterBeta = () => {
  this.productsInMemory = this.productsInMemory.sort((a, b) =>
    a.title.toLowerCase() > b.title.toLowerCase()
      ? -1
      : b.title.toLowerCase() > a.title.toLowerCase()
      ? 1
      : 0
  );
  new UI().displayProdcuts(this.productsInMemory);
};

let minPrice;
let maxPrice;

const onMinPriceFilter = price => {
  //console.log(price);
  this.minPrice = price;
  onPriceFilter();
};
const onMaxPriceFilter = price => {
  //console.log(price);
  this.maxPrice = price;
  onPriceFilter();
};

const onCardClick = e => {
  console.warn("CLICKED", e);
  route();
};

const onPriceFilter = () => {
  const prods = this.productsInMemory.filter(product => {
    return product.price > this.minPrice && product.price < this.maxPrice;
  });
  new UI().displayProdcuts(prods);
};

//searchInput.addEventListener("click", searchHandler);
searchInput.addEventListener("input", searchHandler);
searchInput.addEventListener("propertychange", searchHandler);
alfaFilter.addEventListener("click", filterAlfa);
betaFilter.addEventListener("click", filterBeta);

//filter by price

//main cart info
let cart = [];

//buttons
let buttonsDOM = [];

let productsInMemory = [];

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      console.log(data);
      let products = data.items;
      products = products.map(item => {
        const title = item.cardTitle;
        const price = item.listOfPlans[0].price.amount;
        const id = item.id;
        const image = item.primaryMediaUrl;
        const quantity = item.availableQuantity;
        const description = item.cardDescription;

        return { title, price, id, image, quantity, description };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// //display detailed product
// const navigateTo = id => {
//   console.log(id);
//   url = "product-details.html?id=" + id;
//   //REDIRECT NA PRODUCTS.HTML
//   document.location.href = url;
// };

// const displayProductDetail = prodId => {
//   const foundProd = productsInMemory.find(prod => prod.id == prodId.id);
//   console.log(productsInMemory);

//   console.log(foundProd);
//   let html = `
//         <h1>${foundProd.title}</h1>
//         <h2>${foundProd.id}</h2>
//         <h3>${foundProd.price}</h3>
//     `;
//   document.getElementById("product").innerHTML = html;
// };

// window.onload = function () {
//   var url = document.location.href;
//   const params = url.split("?");
//   // console.log(params);
//   const tmp = params[0].split("=");
//   console.log(tmp);
//   displayProductDetail(tmp[1]);
// };

// display products
class UI {
  displayProdcuts(products) {
    let result = "";

    products.forEach(product => {
      result += `     
      <div class="product" id="product">
          <div class="img-container">
            <img src=${product.image} alt="product" class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart">Add to Cart</i>
            </button>
          </div>
          
          <h3>${product.title}</h3>
          <h4>${product.price}€</h4>
          <h5>${product.description}</h5>
          <h4>${product.quantity} left in stock</h4>
      </div>
        `;
    });
    productsDOM.innerHTML = result;
  }

  getCartButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "Item added to cart";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.preventDefault();
        event.target.innerText = "Item added to cart";
        event.target.style.color = "grey";
        event.target.disabled = true;
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add product to the cart

        cart = [...cart, cartItem];
        console.log(cart);
        //save cart in local storage

        Storage.saveCart(cart);
        //add to cart totals
        this.setCartValues(cart);

        //display cart item

        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let bagTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      bagTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(bagTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="" />
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}€</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
             
            
          </div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentCart");
    cartDOM.classList.add("showCart");
  }

  showFilter() {
    filterOverlay.classList.add("transparentFilter");
    filterDOM.classList.add("showFilter");
  }

  showPanelProducts(products) {
    let result = "";

    products.forEach(product => {
      result += `
          
      <div class="panel-container">
      <img src=${product.image} alt="" style="height: 30px;" />
            <div>
              <h4>${product.title}</h4>
              <h5>${product.price}€</h5>
         </div>
         </div>
        `;
    });
    panelChild.innerHTML = result;
  }

  //show details

  showDetails() {
    detailsOverlay.classList.add("transparentDetails");
    detailsDOM.classList.add("showDetails");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
    filterBtn.addEventListener("click", this.showFilter);
    closeFilterBtn.addEventListener("click", this.hideFilter);
    // detailsBtn.addEventListener("click", this.showDetails);
    // closeDetailsBtn.addEventListener("click", this.hideDetails);
    searchInput.addEventListener("input", this.displaySortedProducts);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentCart");
    cartDOM.classList.remove("showCart");
  }
  hideFilter() {
    filterOverlay.classList.remove("transparentFilter");
    filterDOM.classList.remove("showFilter");
  }
  hideDetails() {
    detailsOverlay.classList.remove("transparentDetails");
    filterDOM.classList.remove("showDetails");
  }
  cartLogic() {
    purchaseCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    //remove single product - change amount
    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let curItem = cart.find(item => item.id === id);
        curItem.amount = curItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = curItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let curItem = cart.find(item => item.id === id);
        curItem.amount = curItem.amount - 1;
        if (curItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = curItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    console.log(cartContent);
    alert("Your order was successful");
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class= "fas fa-shopping-cart"></i>add to cart`;
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

//local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let product = JSON.parse(localStorage.getItem("products"));
    return product.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();

  //get all products
  products
    .getProducts()
    .then(products => {
      this.productsInMemory = shuffle(products);
      ui.displayProdcuts(this.productsInMemory);
      localStorage.setItem("products", JSON.stringify(products));
      const jsonObj = JSON.parse(localStorage.getItem("products"));
      // Storage.saveProducts(products);
    })
    .then(() => {
      ui.getCartButtons();
      ui.cartLogic();
    });
});

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
