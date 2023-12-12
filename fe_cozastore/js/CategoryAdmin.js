$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8080/category',
        type: 'GET',
        success: function (response) {
            let tableBody = $('#categoryTable tbody');
            tableBody.empty();

            response.data.forEach(function (category) {
                let row = '<tr>' +
                    '<td>' + category.id + '</td>' +
                    '<td>' + category.name + '</td>' +
                    '<td>' +
                    '<button class="btn btn-outline-primary btn-sm edit-btn" data-id="' + category.id + '"><i class="fa fa-edit"></i>Edit</button>' +
                    ' ' +
                    '<button class="btn btn-outline-danger btn-sm delete-btn" data-id="' + category.id + '"><i class="fa fa-trash"></i>Delete</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(row);
            })
        },
        error: function (error) {
            console.error(error);
        }
    });

    $("#addCategoryForm").submit(function (e) {
        e.preventDefault();
        let categoryName = $("#categoryName").val();
        // console.log("categoryName", categoryName);
        console.log("token", localStorage.getItem('token'))
        $.ajax({
            url: 'http://localhost:8080/category',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify({ nameCategory: categoryName }),
            success: function (response) {
                let category = response.data;
                let tableBody = $('#categoryTable tbody');
                let newRow = '<tr>' +
                    '<td>' + category.id + '</td>' +
                    '<td>' + category.name + '</td>' +
                    '<td>' +
                    '<button class="btn btn-outline-primary btn-sm edit-btn" data-id="' + category.id + '"><i class="fa fa-edit"></i>Edit</button>' +
                    ' ' +
                    '<button class="btn btn-outline-danger btn-sm delete-btn" data-id="' + category.id + '"><i class="fa fa-trash"></i>Delete</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(newRow);

            },
            error: function (error) {
                console.error(error);
            }
        });
        $('#addCategoryModal').modal('hide');
        window.location.reload();
    });

    $(document).on('click', '.edit-btn', function () {
        let categoryId = $(this).data('id');
        $('#editCategoryModal').find('input[name="categoryId"]').val(categoryId);
        $('#editCategoryModal').modal('show');
    });

    $('#editCategoryForm').submit(function (e) {
        e.preventDefault();
        let categoryId = $(this).find('input[name="categoryId"]').val();
        let categoryName = $(this).find('input[name="categoryName"]').val();

        $.ajax({
            url: 'http://localhost:8080/category/' + categoryId,
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify({ nameCategory: categoryName }),
            success: function (result) {
                $('button.edit-btn[data-id="' + categoryId + '"]').closest('tr').find('td:nth-child(2)').text(categoryName);
            },
            error: function (error) {
                console.error('Error updating category: ', error);
            }
        });

        $('#editCategoryModal').modal('hide');
    });

    $(document).on('click', '.delete-btn', function () {
        let categoryId = $(this).data('id');
        // console.log("categoryId", categoryId);
        if (confirm('Are you sure you want to delete this category?')) {
            $.ajax({
                url: 'http://localhost:8080/category/' + categoryId,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (result) {
                    $('button.delete-btn[data-id="' + categoryId + '"]').closest('tr').remove();
                },
                erorr: function (error) {
                    console.error("Error deleting category: ", error);
                }
            })
        }
    })
})