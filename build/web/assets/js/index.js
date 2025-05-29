
loadProduct();
async function checkSignIn() {
//    loadProduct();
    const response = await fetch("CheckSignIn");

    if (response.ok) {
        const json = await response.json();
        console.log(json);

        const response_dto = json.response_dto;

        if (response_dto.success) {
            // User is signed in
            const user = response_dto.content;

            let st_quick_link = document.getElementById("st-quick-link");

            // Remove existing quick link elements
            document.getElementById("st-quick-link-li-1").remove();
            document.getElementById("st-quick-link-li-2").remove();

            // Add user info to the quick link
            let newLi = document.createElement("li");
            let newLink = document.createElement("a");
            newLink.href = "#";
            newLink.innerHTML = `${user.first_name} ${user.last_name}`;
            newLi.appendChild(newLink);
            st_quick_link.appendChild(newLi);

            let stButton = document.getElementById("st-button-1");
            stButton.href = "SignOut";
            stButton.innerHTML = "Sign Out";

            document.getElementById("st-div-1").remove();
        } else {
            // User is not signed in
            console.log("Not Signed In");
        }


    }
}





var st_product = document.getElementById("ec-product-content");


async function loadProduct() {
    try {
        const response = await fetch("CheckSignIn");

        if (response.ok) {
            const jsonObject = await response.json();

            let product_container = document.getElementById("product-container");

            // Clear the existing product container content
            product_container.innerHTML = "";

            console.log("Update Product:", jsonObject);

            const productList = jsonObject.products;
       
            productList.forEach(item => {
                // Clone the template node
                let st_product_clone = st_product.cloneNode(true);

                // Modify the cloned template

                st_product_clone.querySelector("#s-product-title").innerHTML = item.title;
                st_product_clone.querySelector("#s-product-link").href = `product-full-width.html?id=${item.id}`;
                
                //alert("/product-images/" + item.id + "/image1.png");
                st_product_clone.querySelector("#st-product-image").src = "product-images/" + item.id + "/image1.png";
                st_product_clone.querySelector("#new-price-1").innerHTML = `LKR: ${item.price}.00`;
                st_product_clone.querySelector("#old-price-1").innerHTML = `LKR: ${item.price}.00`;

              

                product_container.appendChild(st_product_clone);
            });

        } else {
            console.log("Error.. Please Try again");
        }
    } catch (e) {
        console.log("Error:", e);
    }
}










async function viewCart() {
    //console.log("View Cart");
    const response = await fetch("cart.html");

    if (response.ok) {
        const cartHtmlText = await response.text();

        const parser = new DOMParser();
        const cartHtml = parser.parseFromString(cartHtmlText, "text/html");

        const cart_main = await cartHtml.querySelector(".main-wrapper");

        document.querySelector(".main-wrapper").innerHTML = cart_main.innerHTML;

        loadCartItems();
        //console.log(cart_main);
    }
}