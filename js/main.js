// js/main.js

// عناصر الـ DOM
const productNameInput = document.getElementById("productName");
const productPriceInput = document.getElementById("productprice");
const productCategoryInput = document.getElementById("productcategory");
const productDescriptionInput = document.getElementById("productdescription");
const productImageInput = document.getElementById("productimge");

const addBtn = document.querySelector("button[onclick='Addproduct()']");
const updateBtn = document.querySelector("button.btn-warning");
const clearBtn = document.querySelector("button.btn-secondary");
const searchInput = document.querySelector("input[type='search']");
const rowData = document.getElementById("rowdata");

let productList = [];
let editingIndex = null;

// عرض البيانات (مع فلتر بحث اختياري)
function displaydata(filter = "") {
  let html = "";
  productList
    .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((prod, i) => {
      html += `
        <div class="col-md-3">
          <div class="card mb-4">
            <img src="${prod.image}" class="card-img-top" alt="${prod.name}">
            <div class="card-body text-center">
              <h5 class="card-title">${prod.name}</h5>
              <p class="card-text">Price: ${prod.price}</p>
              <p class="card-text">Category: ${prod.category}</p>
              <p class="card-text">${prod.description}</p>
            </div>
            <div class="card-footer text-center">
              <button onclick="startEdit(${i})" class="btn btn-outline-warning btn-sm me-2">Update</button>
              <button onclick="deleteProduct(${i})" class="btn btn-outline-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>
      `;
    });
  rowData.innerHTML = html;
}

// إضافة منتج جديد
function Addproduct() {
  // قراءة الصورة من input[type=file]
  const file = productImageInput.files[0];
  if (!productNameInput.value) return alert("Please enter a product name.");
  const reader = new FileReader();
  reader.onload = function (e) {
    const product = {
      name: productNameInput.value.trim(),
      price: productPriceInput.value,
      category: productCategoryInput.value.trim(),
      description: productDescriptionInput.value.trim(),
      image: e.target.result, // Data URL
    };
    productList.push(product);
    clearform();
    displaydata(searchInput.value);
  };
  reader.readAsDataURL(file ?? new Blob()); // إذا ما في ملف، يعرض كارت بدون صورة
}

// بدء وضع التعديل
function startEdit(index) {
  const prod = productList[index];
  productNameInput.value = prod.name;
  productPriceInput.value = prod.price;
  productCategoryInput.value = prod.category;
  productDescriptionInput.value = prod.description;
  // صورة: لا نستطيع إعادة الـ File object، لكن نعرض الـ URL
  // لو حابب ترفع من جديد، يختار المستخدم ملف جديد
  editingIndex = index;
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  // تمرير لأعلى الفورم
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// حفظ التعديل
updateBtn.addEventListener("click", function () {
  if (editingIndex === null) return;
  const file = productImageInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    productList[editingIndex] = {
      name: productNameInput.value.trim(),
      price: productPriceInput.value,
      category: productCategoryInput.value.trim(),
      description: productDescriptionInput.value.trim(),
      image: file ? e.target.result : productList[editingIndex].image,
    };
    clearform();
    toggleButtons(false);
    displaydata(searchInput.value);
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onload({ target: { result: "" } });
  }
});

// حذف منتج
function deleteProduct(index) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  productList.splice(index, 1);
  displaydata(searchInput.value);
}

// تنظيف الفورم وإعادة زرّ الإضافة
function clearform() {
  [productNameInput, productPriceInput, productCategoryInput, productDescriptionInput, productImageInput].forEach(
    (inp) => (inp.value = "")
  );
  toggleButtons(false);
}

// تبديل بين زر الإضافة وزر التحديث
function toggleButtons(isEditing) {
  addBtn.classList.toggle("d-none", isEditing);
  updateBtn.classList.toggle("d-none", !isEditing);
  editingIndex = isEditing ? editingIndex : null;
}

// بحث تفاعلي
searchInput.addEventListener("input", function () {
  displaydata(this.value);
});

// زرّ Clear (اختياري لو ضفته)
// clearBtn.addEventListener("click", function () {
//   clearform();
// });

/* 
  أخيراً: استدعاء العرض الأولي (فارغ)
  هذا السطر يضمن أن الكاردات تُعرض حتى لو ما في منتجات.
*/
displaydata();
