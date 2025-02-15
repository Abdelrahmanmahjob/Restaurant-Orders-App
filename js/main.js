import {menuArray} from "./data.js"
const clientsOrders = document.querySelector(".clients-orders")
const totalPrices = document.getElementById("total-price")
const userForm = document.querySelector(".user-form")

document.addEventListener('click' , (e) => {
    if (e.target.dataset.id) {
        addOrder(Number(e.target.dataset.id))
    }
    
    if (e.target.dataset.remove) {
        removeOrder(Number(e.target.dataset.remove))
    }
    
    if (e.target.dataset.completeOrder) {
        document.querySelector(".overlay").classList.remove("hidden") 
        document.querySelector(".card-details").classList.remove("hidden")
    }

    if (e.target.dataset.close) {
        document.querySelector(".overlay").classList.add("hidden") 
        document.querySelector(".card-details").classList.add("hidden")
    }

})


let orders = {}  // استبدال ordersHtml بمصفوفة كائنات لتجنب التكرار
let order = ""
function addOrder(orderId) {
    const orderObj = menuArray.find(menu => menu.id === orderId)  // استخدم find بدلًا من filter[0]
    
    if (orders[orderId]) {
        // إذا كان الطلب موجودًا، قم بتحديث الكمية والسعر فقط
        orders[orderId].quantity += 1
        document.querySelector(`#quantity-${orderId}`).textContent = orders[orderId].quantity
        document.querySelector(`#price-${orderId}`).textContent = `$${orders[orderId].quantity * orderObj.price}`
    } else {
        // إذا لم يكن موجودًا، أضفه إلى الكارت
        orders[orderId] = { ...orderObj, quantity: 1 }

        order = `
        <div class="order-content" id="order-${orderId}">
            <h2>${orderObj.name} <span>${orderObj.emoji}</span></h2>
            <span class="order-number">x <span id="quantity-${orderId}">1</span></span>
            <span class="remove-order" data-remove="${orderId}">remove</span>
            <span class="price" id="price-${orderId}">$${orderObj.price}</span>
        </div>
        `

        // clientsOrders.innerHTML += order  // أضف العنصر الجديد إلى الـ DOM مباشرة
        clientsOrders.insertAdjacentHTML("beforeend", order)
    }

    updateTotalPrice()
    document.querySelector(".order-cart-section").classList.remove("hidden")
}

function removeOrder(orderId) {
    if (orders[orderId]) {
        if (orders[orderId].quantity > 1) {
            // إذا كان العدد أكثر من 1، قم بإنقاصه فقط
            orders[orderId].quantity -= 1
            document.querySelector(`#quantity-${orderId}`).textContent = orders[orderId].quantity
            document.querySelector(`#price-${orderId}`).textContent = `$${orders[orderId].quantity * orders[orderId].price}`
        } else {
            // إذا كانت الكمية 1، قم بإزالته من القائمة والـ DOM
            delete orders[orderId]
            document.querySelector(`#order-${orderId}`).remove()
        }
    }
    
    if(clientsOrders.childElementCount === 0) {
        document.querySelector(".order-cart-section").classList.add("hidden")
    }

    updateTotalPrice()
}

function updateTotalPrice() {
    let total = Object.values(orders).reduce((sum, item) => sum + item.price * item.quantity, 0)
    totalPrices.textContent = "$" + total
}

userForm.addEventListener("submit", e => {
    e.preventDefault()

    document.querySelector(".overlay").classList.add("hidden") 
    document.querySelector(".card-details").classList.add("hidden")
    document.querySelector(".order-cart-section").classList.add("hidden")

    let userFormData = new FormData(e.target)
    let userName = userFormData.get("user-name")
    
    const orderMessage = `<div class="order-message">Thanks, ${userName}! Your order is on its way! 🚀</div>`
    // ✅ استخدام insertAdjacentHTML بدلاً من innerHTML حتى لا نحذف `clientsOrders`
    document.querySelector("main").insertAdjacentHTML("beforeend", orderMessage)

    // ✅ إعادة ضبط الطلبات بشكل صحيح
    orders = {}  
    clientsOrders.innerHTML = ""  // 🟢 امسح جميع الطلبات من الـ DOM
    totalPrices.textContent = "$0"  // 🟢 إعادة ضبط السعر الإجمالي
    userForm.reset()  // 🟢 إعادة ضبط المدخلات في النموذج
    
    // ✅ إزالة رسالة التأكيد بعد 3 ثوانٍ
    setTimeout(() => {
        document.querySelector(".order-message").remove()
    }, 3000)
})

function getMenuHtml() {
    return menuArray.map(menu => {
        const ingredients = menu.ingredients.map(ingredient => {
            return ingredient
        }).join(', ')

        return `
            <div class="order-box">
                <div class="order">
                    <div class="order-image">${menu.emoji}</div>
                    <div class="order-des">
                        <h2>${menu.name}</h2>
                        <p class="ingredients">${ingredients}</p>
                        <p class="order-price">$${menu.price}</p>
                    </div>
                </div>
                <div class="add-order" data-id="${menu.id}">+</div>
            </div>
        `
    }).join("")
}

// console.log(getAppHtml())
function render() {
    document.getElementById("menu-section").innerHTML = getMenuHtml()
}

render()