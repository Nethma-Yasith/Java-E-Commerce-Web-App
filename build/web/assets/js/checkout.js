payhere.onCompleted = function onCompleted(orderId) {
    console.log("Payment completed. OrderID:" + orderId);
    // Note: validate the payment and show success or failure page to the customer
    Swal.fire({
                title: 'Success!',
                text: "Order Placed. Thank You",
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            window.location = "index.html";
};

// Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
};

// Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
};



var address;

async function loadData() {

    console.log("test");


    const response = await fetch(
            "LoadCheckout"
            );

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        if (json.success) {
            //store response data
            const address = json.address;
            const cityList = json.cityList;
            const cartList = json.cartList;

            let citySelect = document.getElementById("city");
            citySelect.length = 1;

            cityList.forEach(city => {

                let cityOption = document.createElement("option");
                cityOption.value = city.id;
                cityOption.innerHTML = city.name;
                citySelect.appendChild(cityOption);
            });

            //load current address
            let currnetAddressCheckbox = document.getElementById("checkbox1");
            currnetAddressCheckbox.addEventListener("change", e => {

                let first_name = document.getElementById("first-name");
                let last_name = document.getElementById("last-name");
                let city = document.getElementById("city");
                let address1 = document.getElementById("address1");
                let address2 = document.getElementById("address2");
                let postal_code = document.getElementById("postal-code");
                let mobile = document.getElementById("mobile");
                if (currnetAddressCheckbox.checked) {

                    first_name.value = address.first_name;
                    first_name.disabled = true;
                    last_name.value = address.last_name;
                    last_name.disabled = true;

                    city.value = address.city.id;
                    city.disabled = true;
                    city.dispatchEvent(new Event("change")); //balen event ekak call karna wdiha

                    address1.value = address.line1;
                    address1.disabled = true;
                    address2.value = address.line2;
                    address2.disabled = true;
                    postal_code.value = address.postal_code;
                    postal_code.disabled = true;
                    mobile.value = address.mobile;
                    mobile.disabled = true;
                } else {

                    first_name.value = "";
                    first_name.disabled = false;
                    last_name.value = "";
                    last_name.disabled = false;

                    city.value = 0;
                    city.disabled = false;
                    city.dispatchEvent(new Event("change"));//balen event ekak call karna wdiha

                    address1.value = "";
                    address1.disabled = false;
                    address2.value = "";
                    address2.disabled = false;
                    postal_code.value = "";
                    postal_code.disabled = false;
                    mobile.value = "";
                    mobile.disabled = false;
                }
            });

            //load cart items
            let st_tbody = document.getElementById("st-tbody");
            let st_item_tr = document.getElementById("st-item-tr");
            let st_order_subtotal_tr = document.getElementById("st-order-subtotal-tr");
            let st_order_shipping_tr = document.getElementById("st-order-shipping-tr");
            let st_order_total_tr = document.getElementById("st-order-total-tr");
            st_tbody.innerHTML = "";

            let sub_total = 0;

            cartList.forEach(item => {
                let st_item_clone = st_item_tr.cloneNode(true);
                st_item_clone.querySelector("#st-item-title").innerHTML = item.product.title;
                st_item_clone.querySelector("#st-item-qty").innerHTML = item.qty;

                let item_sub_total = item.product.price * item.qty;
                sub_total += item_sub_total;

                st_item_clone.querySelector("#st-item-subtotal").innerHTML = new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format((item_sub_total));

                st_tbody.appendChild(st_item_clone);
            });
            st_order_subtotal_tr.querySelector("#st-subtotal").innerHTML = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2
            }).format((sub_total));
            st_tbody.appendChild(st_order_subtotal_tr);



            citySelect.addEventListener("change", e => {

                //update shipping charges

                //get cart item count
                let item_count = cartList.length;
                let shipping_amount = 0;
                //colombo
                if (citySelect.value == 1) {
                    //Colombo
                    shipping_amount = item_count * 1000;
                } else {
                    //Out of Colombo
                    shipping_amount = item_count * 2500;
                }
                st_order_shipping_tr.querySelector("#st-shipping-amount").innerHTML = new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format((shipping_amount));
                st_tbody.appendChild(st_order_shipping_tr);

                //update  total
                let total = sub_total + shipping_amount;
                st_order_total_tr.querySelector("#st-total").innerHTML = new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format((total));
                st_tbody.appendChild(st_order_total_tr);

            });

            city.dispatchEvent(new Event("change"));

        } else {
            window.location = "login.html";
        }
    }
}

async function checkout() {
    
    console.log("checkout");
    //chek address status
    let isCurrentAddress = document.getElementById("checkbox1").checked;

    //get address data
    let first_name = document.getElementById("first-name");
    let last_name = document.getElementById("last-name");
    let city = document.getElementById("city");
    let address1 = document.getElementById("address1");
    let address2 = document.getElementById("address2");
    let postal_code = document.getElementById("postal-code");
    let mobile = document.getElementById("mobile");

    //request data(json)
    const data = {

        isCurrentAddress: isCurrentAddress,
        first_name: first_name.value,
        last_name: last_name.value,
        city_id: city.value,
        address1: address1.value,
        address2: address2.value,
        postal_code: postal_code.value,
        mobile: mobile.value

    };

    const response = await fetch(
            "Checkout",
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content_Type": "application/json"
                }
            }
    );

    if (response.ok) {
        const json = await response.json();
        //console.log(json);

        if (json.success) {
            
            //Start PayHere Payment
            console.log(json.payhereJson);
            payhere.startPayment(json.payhereJson);
            
//       
            //window.location = "index.html";

        } else {
            //console.log();
            Swal.fire({
                title: 'Error!',
                text: json.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    } else {
        //console.log("Try again later!");
        Swal.fire({
            title: 'Error!',
            text: "Try again later!",
            icon: 'error',
            confirmButtonText: 'OK'
        });

    }
    //console.log(data);

}



