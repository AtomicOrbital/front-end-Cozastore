$(document).ready(function () {
    $.ajax({
        url: 'http://localhost:8080/api/tags',
        type: 'GET',
        success: function (response) {
            let tableBody = $('#tagsTable tbody');
            tableBody.empty();

            response.data.forEach(function (tag) {
                let row = '<tr>' +
                    '<td>' + tag.id + '</td>' +
                    '<td>' + tag.nameTag + '</td>' +
                    '<td>' +
                    '<button class="btn btn-outline-primary btn-sm edit-btn" data-id="' + tag.id + '"><i class="fa fa-edit"></i>Edit</button>' +
                    ' ' +
                    '<button class="btn btn-outline-danger btn-sm delete-btn" data-id="' + tag.id + '"><i class="fa fa-trash"></i>Delete</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(row);
            })
        },
        error: function (error) {
            console.error(error);
        }
    });

    $("#addTagsForm").submit(function (e) {
        e.preventDefault();
        let tagName = $("#tagName").val();
        // console.log("categoryName", categoryName);
        console.log("token", localStorage.getItem('token'))
        $.ajax({
            url: 'http://localhost:8080/api/tags',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify({ nameTag: tagName }),
            success: function (response) {
                let tag = response.data;
                let tableBody = $('#tagsTable tbody');
                let newRow = '<tr>' +
                    '<td>' + tag.id + '</td>' +
                    '<td>' + tag.tagName + '</td>' +
                    '<td>' +
                    '<button class="btn btn-outline-primary btn-sm edit-btn" data-id="' + tag.id + '"><i class="fa fa-edit"></i>Edit</button>' +
                    ' ' +
                    '<button class="btn btn-outline-danger btn-sm delete-btn" data-id="' + tag.id + '"><i class="fa fa-trash"></i>Delete</button>' +
                    '</td>' +
                    '</tr>';
                tableBody.append(newRow);

            },
            error: function (error) {
                console.error(error);
            }
        });
        $('#addTagsModal').modal('hide');
        window.location.reload();
    });

    $(document).on('click', '.edit-btn', function () {
        let tagId = $(this).data('id');
        $('#editTagsModal').find('input[name="tagId"]').val(tagId);
        $('#editTagsModal').modal('show');
    });

    $('#editTagsForm').submit(function (e) {
        e.preventDefault();
        let tagId = $(this).find('input[name="tagId"]').val();
        let tagName = $(this).find('input[name="tagName"]').val();

        $.ajax({
            url: 'http://localhost:8080/api/tags/' + tagId,
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify({ nameTag: categoryName }),
            success: function (result) {
                $('button.edit-btn[data-id="' + tagId + '"]').closest('tr').find('td:nth-child(2)').text(tagName);
            },
            error: function (error) {
                console.error('Error updating tag: ', error);
            }
        });

        $('#editTagsModal').modal('hide');
    });

    $(document).on('click', '.delete-btn', function () {
        let tagId = $(this).data('id');
        // console.log("categoryId", categoryId);
        if (confirm('Are you sure you want to delete this tag?')) {
            $.ajax({
                url: 'http://localhost:8080/api/tags/' + tagId,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function (result) {
                    $('button.delete-btn[data-id="' + tagId + '"]').closest('tr').remove();
                },
                erorr: function (error) {
                    console.error("Error deleting tag: ", error);
                }
            })
        }
    })
})