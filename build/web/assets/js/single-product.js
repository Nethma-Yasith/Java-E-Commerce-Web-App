async function loadProduct() {

    const parameters = new URLSearchParams(window.location.search);

    if (parameters.has("id")) {

        const productId = parameters.get("id");

        const response = await fetch("LoadSingleProduct?id=" + productId);

        if (response.ok) {
            const json = await response.json();
            console.log(json.product.id);
            //console.log(json.productList);
            const id = json.product.id;
            document.getElementById("image1").src = "product-images/" + id + "/image1.png";
            document.getElementById("image2").src = "product-images/" + id + "/image2.png";
            document.getElementById("image3").src = "product-images/" + id + "/image3.png";

            document.getElementById("image1-thumb").src = "product-images/" + id + "/image1.png";
            document.getElementById("image2-thumb").src = "product-images/" + id + "/image2.png";
            document.getElementById("image3-thumb").src = "product-images/" + id + "/image3.png";

            document.getElementById("product-title").innerHTML = json.product.title;
            document.getElementById("product-published-on").innerHTML = json.product.date_time;
            document.getElementById("product-price").innerHTML = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2
            }).format(json.product.price);

            document.getElementById("product-category").innerHTML = json.product.model.category.name;
            document.getElementById("product-model").innerHTML = json.product.model.name;
            document.getElementById("product-condition").innerHTML = json.product.product_condition.name;
            document.getElementById("product-qty").innerHTML = json.product.qty;

            document.getElementById("color-border").style.borderColor = json.product.color.name;
            document.getElementById("color-background").style.backgroundColor = json.product.color.name;

            document.getElementById("product-stroge").innerHTML = json.product.storage.value;
            document.getElementById("product-description").innerHTML = json.product.description;

            document.getElementById("add-to-cart-main").addEventListener(
                    "click",
                    (e) => {
                addToCart(
                        json.product.id,
                        document.getElementById("add-to-cart-qty").value
                        );
                e.preventDefault();
            });

            let ProductHtml = document.getElementById("similer-product");
            document.getElementById("similer-product-main").innerHTML = "";

            json.productList.forEach(item => {


                let ProductCloneHtml = ProductHtml.cloneNode(true);

                //clone karapu akak athule thiyenawanam querySelector danna one
                ProductCloneHtml.querySelector("#similer-product-a1").href = "product-full-width.html?id=" + item.id;
                ProductCloneHtml.querySelector("#similer-product-image").src = "product-images/" + item.id + "/image1.png";
                ProductCloneHtml.querySelector("#similer-product-a2").src = "product-full-width.html?id=" + item.id;
                ProductCloneHtml.querySelector("#similer-product-title").innerHTML = item.title;
                ProductCloneHtml.querySelector("#similer-product-storage").innerHTML = item.storage.value;
                ProductCloneHtml.querySelector("#similer-product-price").innerHTML = "Rs. " + new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format(json.product.price);

                ProductCloneHtml.querySelector("#similer-product-color-border").style.borderColor = item.color.name;
                ProductCloneHtml.querySelector("#similer-product-color").style.backgroundColor = item.color.name;

                ProductCloneHtml.querySelector("#similer-product-add-to-cart").addEventListener(
                        "click",
                        (e) => {
                    addToCart(item.id, 1);
                    e.preventDefault();
                });

                document.getElementById("similer-product-main").appendChild(ProductCloneHtml);

            });

            $('.recent-product-activation').slick({
                infinite: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                arrows: true,
                dots: false,
                prevArrow: '<button class="slide-arrow prev-arrow"><i class="fal fa-long-arrow-left"></i></button>',
                nextArrow: '<button class="slide-arrow next-arrow"><i class="fal fa-long-arrow-right"></i></button>',
                responsive: [{
                        breakpoint: 1199,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 479,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });

        } else {
            window.location = "index.html";
        }

    } else {
        window.location = "index.html";
    }


}



async function addToCart(id, qty) {
//    console.log("add to cart: " + id);
//    console.log("add to cart: " + qty);
    const response = await fetch(
            "AddToCart?id=" + id + "&qty=" + qty

            );

    if (response.ok) {
        const json = await response.json();

        if (json.success) {
            Swal.fire({
                title: 'Success!',
                text: json.content,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: json.content,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    } else {
        //document.getElementById("message").innerHTML = "Please Try again later!";
        Swal.fire({
            title: 'Error!',
            text: "Unable to process your request",
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

}

