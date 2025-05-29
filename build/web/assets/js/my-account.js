
var modelList;

async function  loadFatures() {


    const response = await fetch(
            "LoadFeatures"

            );

    if (response.ok) {
        const json = await response.json();

        const categoryList = json.categoryList;
        modelList = json.modelList;
        const colorList = json.colorList;
        const storageList = json.storageList;
        const conditionList = json.conditionList;

        loadSelect("categorySelect", categoryList, "name");
        //loadSelect("modelSelect",modelList,"name");
        loadSelect("storageSelect", storageList, "value");
        loadSelect("colorSelect", colorList, "name");
        loadSelect("conditionSelect", conditionList, "name");

        //console.log(categoryList[0].name);
//        const categorySelect = document.getElementById("categorySelect");
//        categoryList.forEach(category=>{
//            let optionTag = document.createElement("option");
//            optionTag.value = category.id;
//            optionTag.innerHTML = category.name;
//            categorySelect.appendChild(optionTag);
//            
//        });

    } else {
        document.getElementById("message").innerHTML = "Please Try again later!";
    }
}

function loadSelect(selectTagId, list, property) {

    const SelectTag = document.getElementById(selectTagId);
    list.forEach(item => {
        let optionTag = document.createElement("option");
        optionTag.value = item.id;
        optionTag.innerHTML = item[property];
        SelectTag.appendChild(optionTag);

    });
}

function updateModels() {

    let modelSelectTag = document.getElementById("modelSelect");
    modelSelectTag.length = 1;
    let selectedcategoryId = document.getElementById("categorySelect").value;



    modelList.forEach(model => {
        if (model.category.id == selectedcategoryId) {
            let optionTag = document.createElement("option");
            optionTag.value = model.id;
            optionTag.innerHTML = model.name;
            modelSelectTag.appendChild(optionTag);
        }
    });

}

async function productListing() {

    const categorySelectTag = document.getElementById("categorySelect");
    const modelSelectTag = document.getElementById("modelSelect");
    const titleTag = document.getElementById("title");
    const descriptionTag = document.getElementById("description");
    const storageSelectTag = document.getElementById("storageSelect");
    const colorSelectTag = document.getElementById("colorSelect");
    const conditionSelectTag = document.getElementById("conditionSelect");
    const priceTag = document.getElementById("price");
    const quantityTag = document.getElementById("quantity");
    const image1Tag = document.getElementById("image1");
    const image2Tag = document.getElementById("image2");
    const image3Tag = document.getElementById("image3");

    const data = new FormData();
    data.append("categoryId", categorySelectTag.value);
    data.append("modelId", modelSelectTag.value);
    data.append("title", titleTag.value);
    data.append("description", descriptionTag.value);
    data.append("storageId", storageSelectTag.value);
    data.append("colorId", colorSelectTag.value);
    data.append("conditionId", conditionSelectTag.value);
    data.append("price", priceTag.value);
    data.append("quantity", quantityTag.value);
    data.append("image1", image1Tag.files[0]);
    data.append("image2", image2Tag.files[0]);
    data.append("image3", image3Tag.files[0]);


    const response = await fetch(
            "ProductListing",
            {
                method: "POST",
                body: data

            }
    );

    if (response.ok) {
        const json = await response.json();

        //const messageTag = document.getElementById("message");

        if (json.success) {

            categorySelectTag.value = 0;
            modelSelectTag.length = 1;
            titleTag.value = "";
            descriptionTag.value = "";
            storageSelectTag.value = 0;
            colorSelectTag.value = 0;
            conditionSelectTag.value = 0;
            priceTag.value = "";
            quantityTag.value = 1;
            image1Tag.value = null;
            image2Tag.value = null;
            image3Tag.value = null;

//            messageTag.innerHTML = json.content;
//            messageTag.className = "text-success";

            Swal.fire({
                title: 'Success!',
                text: json.content,
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } else {
//            messageTag.innerHTML = json.content;
//            messageTag.className = "text-danger";
            
              Swal.fire({
                title: 'Error!',
                text: json.content,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    } else {
        document.getElementById("message").innerHTML = "Please Try again later!";
    }

}
 