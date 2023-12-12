function fetchProductDetails() {
    $.ajax({
        url: 'http://localhost:8080/product-details',
        type: 'GET',
        success: function (response) {
            console.log("response", response);
            let productDetails = response.data;
            let productDetailsTableBody = $('#productDetailsTable tbody');
            productDetailsTableBody.empty();

            productDetails.forEach(function (detail) {
                productDetailsTableBody.append(
                    '<tr>' +
                    '<td>' + detail.id + '</td>' +
                    '<td>' + detail.nameColor + '</td>' +
                    '<td>' + detail.nameProduct + '</td>' +
                    '<td>' + detail.nameSize + '</td>' +
                    '<td>' + detail.quantity + '</td>' +
                    '<td>' + detail.description + '</td>' +
                    '<td>' +
                    '<button class="btn btn-outline-primary edit-btn" data-id="' + detail.id + '"><i class="fa fa-edit"></i>Edit</button>' +
                    '<button class="btn btn-outline-danger delete-btn" data-id="' + detail.id + '"><i class="fa fa-trash"></i>Delete</button>' +
                    '</td>' +
                    '</tr>'
                );
            });
        },
        error: function (error) {
            console.error('Error fetching product details:', error);
        }
    });
}

function loadSize(targetSelector) {
    $.ajax({
        url: 'http://localhost:8080/api/sizes',
        type: 'GET',
        success: function (response) {
            let sizes = response.data;
            let sizeSelect = $(targetSelector);
            sizeSelect.empty().append('<option value="">Select a size</option>');
            sizes.forEach(function (size) {
                sizeSelect.append(new Option(size.sizeName, size.id));
            });
        },
        error: function (error) {
            console.error('Error fetching sizes:', error);
        }
    });
}


function loadColor(targetSelector) {
    $.ajax({
        url: 'http://localhost:8080/api/colors',
        type: 'GET',
        success: function (response) {
            let colors = response.data;
            let colorSelect = $(targetSelector);
            colorSelect.empty().append('<option value="">Select a color</option>');
            colors.forEach(function (color) {
                colorSelect.append(new Option(color.colorName, color.id));
            });
        },
        error: function (error) {
            console.error('Error fetching colors:', error);
        }
    });
}

function fetchProduct(targetSelector) {
    $.ajax({
        url: 'http://localhost:8080/product',
        type: 'GET',
        success: function (response) {
            let products = response.data;
            let productSelect = $(targetSelector);
            productSelect.empty().append('<option value="">Select a product</option>');
            products.forEach(function (product) {
                productSelect.append(new Option(product.title, product.id));
            });
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}


$(document).ready(function () {
    fetchProductDetails();
    loadColor("#colorName");
    loadSize("#sizeName");
    fetchProduct("#productName");




    $('#addProductDetailsForm').submit(function (e) {
        e.preventDefault();

        let data = {
            idColor: $('#colorName').val(),
            idProduct: $('#productName').val(),
            idSize: $('#sizeName').val(),
            quantity: $('#quantity').val(),
            description: $('#description').val()
        };

        $.ajax({
            url: 'http://localhost:8080/product-details',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (response) {
                $('#addProductDetailsModal').modal('hide');
                fetchProductDetails();
            },
            error: function (error) {
                console.error('Error adding product detail:', error);
            }
        });
    });

    $(document).on('click', '.edit-btn', function () {
        let productDetailId = $(this).data('id');
        // console.log("productDetailId", productDetailId);
        // $('#editProductDetailModal').modal('show');
        loadColor("#editColorName");
        loadSize("#editSizeName");
        fetchProduct("#editProductName");
        $.ajax({
            url: 'http://localhost:8080/product-details/' + productDetailId,
            type: 'GET',
            success: function (response) {
                console.log("response product detail", response);
                if (response.statusCode === 200 && response.message === "SUCCESS") {
                    $('#productDetailId').val(response.data.id);
                    $('#editColorName').val(response.data.nameColor);
                    $('#editProductName').val(response.data.nameProduct);
                    $('#editSizeName').val(response.data.nameSize);
                    $('#editQuantity').val(response.data.quantity);
                    $('#editDescription').val(response.data.description);
                }

                $('#editProductDetailModal').modal('show');
            },
            error: function (error) {
                console.error('Error fetching product detail:', error);
            }
        });
    });

    $('#editProductDetailForm').submit(function (e) {
        e.preventDefault();

        let productDetailId = $('#productDetailId').val();
        let data = {
            idColor: $('#editColorName').val(),
            idProduct: $('#editProductName').val(),
            idSize: $('#editSizeName').val(),
            quantity: $('#editQuantity').val(),
            description: $('#editDescription').val()
        };

        $.ajax({
            url: 'http://localhost:8080/product-details/' + productDetailId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (response) {
                $('#editProductDetailModal').modal('hide');
                fetchProductDetails(); // Làm mới bảng
            },
            error: function (error) {
                console.error('Error updating product detail:', error);
            }
        });
    });


    $(document).on('click', '.delete-btn', function () {
        if (confirm('Are you sure you want to delete this product detail?')) {
            let productId = $(this).data('id');
            $.ajax({
                url: 'http://localhost:8080/product-details/' + productId,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (result) {
                    fetchProductDetails();
                },
                error: function (error) {
                    console.error('Error deleting product:', error);
                }
            });
        }
    });


});
