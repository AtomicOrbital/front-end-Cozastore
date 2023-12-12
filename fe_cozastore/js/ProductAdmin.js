function fetchProduct() {
    let categories = {};
    let tags = {};

    $.ajax({
        url: 'http://localhost:8080/category',
        type: 'GET',
        success: function (response) {

            response.data.forEach(function (category) {
                // console.log("category", category);
                categories[category.id] = category.name;
            })
        }
    });

    $.ajax({
        url: 'http://localhost:8080/api/tags',
        type: 'GET',
        success: function (response) {
            response.data.forEach(function (tag) {
                console.log("tag", tag);
                tags[tag.id] = tag.nameTag;
            })
        }
    });

    $.ajax({
        url: 'http://localhost:8080/product',
        type: 'GET',
        success: function (response) {
            let products = response.data;
            let productTableBody = $('#productTable tbody');
            productTableBody.empty();

            products.forEach(function (product) {
                let categoryName = categories[product.idCategory] || 'Unknown Category';
                let tagNames = product.tags.split(',').map(tagId => tags[tagId]).join(', ');
                productTableBody.append(
                    '<tr>' +
                    '<td>' + product.id + '</td>' +
                    '<td><img src="http://localhost:8080/api/images/' + product.images + '" alt="Product Image" style="width:50px;height:50px;"/></td>' +
                    '<td>' + product.title + '</td>' +
                    '<td>' + product.price + '</td>' +
                    '<td>' + categoryName + '</td>' +
                    '<td>' + tagNames + '</td>' +
                    '<td>' +
                    '<button class="btn btn-outline-primary edit-btn" data-id="' + product.id + '"><i class="fa fa-edit"></i>Edit</button>' +
                    '<button class="btn btn-outline-danger delete-btn" data-id="' + product.id + '"><i class="fa fa-trash"></i>Delete</button>' +
                    '</td>' +
                    '</tr>'
                );
            });
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}

function fetchProductData(productId) {
    $.ajax({
        url: 'http://localhost:8080/product/' + productId,
        type: 'GET',
        success: function (response) {
            // Dien du lieu vao form
            $('#editTitleName').val(response.title);
            $('#editPrice').val(response.price);

        },
        error: function (error) {
            console.error("Error fetching product details: ", error);
        }
    })
}

function loadCategories(targetSelector) {
    $.ajax({
        url: 'http://localhost:8080/category',
        type: 'GET',
        success: function (response) {
            let categories = response.data;
            let categorySelect = $(targetSelector);
            categorySelect.empty().append('<option value="">Select a category</option>');
            categories.forEach(function (category) {
                categorySelect.append(new Option(category.name, category.id));
            });
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        }
    });
}

function loadTags(targetSelector) {
    $.ajax({
        url: 'http://localhost:8080/api/tags',
        type: 'GET',
        success: function (response) {
            let tags = response.data;
            let tagSelect = $(targetSelector);
            tagSelect.empty().append('<option value="">Select a tag</option>');
            tags.forEach(function (tag) {
                tagSelect.append(new Option(tag.nameTag, tag.id));
            });
        },
        error: function (error) {
            console.error('Error fetching tags:', error);
        }
    });
}

$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8080/category',
        type: 'GET',
        success: function (response) {
            let categories = response.data;
            let categorySelect = $('#category');
            categories.forEach(function (category) {
                categorySelect.append(new Option(category.name, category.id));
            });
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        }
    });

    $.ajax({
        url: 'http://localhost:8080/api/tags',
        type: 'GET',
        success: function (response) {
            let tags = response.data;
            let tagSelect = $('#tag');
            tags.forEach(function (tag) {
                tagSelect.append(new Option(tag.nameTag, tag.id));
            });
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        }
    });

    $('#imageProduct').change(function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    fetchProduct();

    $('#addProductForm').submit(function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        formData.append('title', $('#titleName').val());
        formData.append('price', $('#price').val());
        formData.append('idCategory', $('#category').val());
        formData.append('tags', $('#tag').val());
        formData.append('file', $('#imageProduct')[0].files[0]);

        $.ajax({
            url: 'http://localhost:8080/product',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (response) {
                fetchProduct();
                $('#addProductModal').modal('hide');
            },
            error: function (error) {
                console.error('Error adding product:', error);
            }
        });
    });

    $(document).on('click', '.edit-btn', function () {
        let productId = $(this).data('id');
        //Tai du lieu san pham hien tai tu server
        fetchProductData(productId);
        // Tai lai danh muc va the
        loadCategories('#editCategory');
        loadTags('#editTag')
        $('#editProductModal').find('input[name="productId"]').val(productId);
        $('#editProductModal').modal('show');
    });

    $('#editProductForm').submit(function (e) {
        e.preventDefault();

        let productId = $('#editProductModal input[name="productId"]').val();
        console.log("productId", productId);

        let formData = new FormData(this);
        formData.append('file', $('#editImageProduct')[0].files[0]);
        formData.append('title', $('#editTitleName').val());
        formData.append('price', $('#editPrice').val());
        formData.append('idCategory', $('#editCategory').val());
        formData.append('tags', $('#editTag').val());

        $.ajax({
            url: 'http://localhost:8080/product/' + productId,
            type: 'PUT',
            processData: false,
            contentType: false,
            data: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (response) {
                $('#editProductModal').modal('hide');
                fetchProduct();
            },
            error: function (error) {
                console.error('Error updating product:', error);
            }
        });
    });

    $(document).on('click', '.delete-btn', function () {
        if (confirm('Are you sure you want to delete this product?')) {
            let productId = $(this).data('id');
            $.ajax({
                url: 'http://localhost:8080/product/' + productId,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (result) {
                    fetchProduct();
                },
                error: function (error) {
                    console.error('Error deleting product:', error);
                }
            });
        }
    });


});
