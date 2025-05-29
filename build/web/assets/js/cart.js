
async function loadCartItems() {

    const response = await fetch(
            "LoadCartitems"
            );

    if (response.ok) {
        const json = await response.json();

        console.log(json);

        if (json.length == 0) {
            //window.location = "index.html";
            Swal.fire({
                title: 'Error!',
                text: "Your Cart is Empty",
                icon: 'error',
                confirmButtonText: 'OK'
            });

            //window.location = "index.html";
        } else {

            console.log(json);

            let cartItemContainer = document.getElementById("cart-item-container");
            let cartItemRow = document.getElementById("cart-item-row");

            cartItemContainer.innerHTML = "";

            let totalQty = 0;
            let total = 0;

            json.forEach(item => {

                let itemSubTotal = item.product.price * item.qty;
                totalQty += item.qty;
                total += itemSubTotal;

                let cartItemRowClone = cartItemRow.cloneNode(true);
                cartItemRowClone.querySelector("#cart-item-a").href = "product-full-width.html?id=" + item.product.id;
                cartItemRowClone.querySelector("#cart-item-image").src = "product-images/" + item.product.id + "/image1.png";
                cartItemRowClone.querySelector("#cart-item-title").innerHTML = item.product.title;
                cartItemRowClone.querySelector("#cart-item-price").innerHTML = "Rs. " + new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format(item.product.price);

                cartItemRowClone.querySelector("#cart-item-qty").value = item.qty;
                cartItemRowClone.querySelector("#cart-item-subtotal").innerHTML = "Rs. " + new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format((itemSubTotal));

                cartItemContainer.appendChild(cartItemRowClone);
            });

            document.getElementById("cart-total-qty").innerHTML = totalQty;
            document.getElementById("cart-total").innerHTML = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2
            }).format((total));


        }

    } else {

        Swal.fire({
            title: 'Error!',
            text: "Unable to process your request",
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}


