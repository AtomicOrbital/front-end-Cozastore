$(document).ready(function () {
    var blogContainer = $('#blog-container'); // Replace with your actual container ID
    $.ajax({
        url: 'http://localhost:8080/blogs',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                displayBlog(response.data);
                
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    function displayBlog(blogs) {

        blogs.forEach(function (blog) {
            // Create an Image object to load the image
            var img = new Image();
            
            // Set up the onload and onerror handlers
            img.onload = function () {
                // Create HTML elements for each blog
                var blogHtml = `
                <div class="p-b-63">
                    <a href="blog-detail.html" class="hov-img0 how-pos5-parent">
                    <img src="${img.src}" alt="${blog.title}" />
                    <div class="flex-col-c-m size-123 bg9 how-pos5">
                        <span class="ltext-107 cl2 txt-center"> 22 </span>
                        <span class="stext-109 cl3 txt-center"> Jan 2018 </span>
                    </div>
                    </a>
                    <div class="p-t-32">
                    <h4 class="p-b-15">
                        <a
                        href="blog-detail.html"
                        class="ltext-108 cl2 hov-cl1 trans-04"
                        >
                        ${blog.title}
                        </a>
                    </h4>
                    <p class="stext-117 cl6">
                        ${blog.content}
                    </p>
                    <div class="flex-w flex-sb-m p-t-18">
                        <span class="flex-w flex-m stext-111 cl2 p-r-30 m-tb-10">
                        <span>
                            <span class="cl4">By</span> Admin
                            <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>
                        <span>
                            ${blog.tags}
                            <span class="cl12 m-l-4 m-r-6">|</span>
                        </span>
                        <span> 8 Comments </span>
                        </span>
                        <a
                        href="blog-detail.html"
                        class="stext-101 cl2 hov-cl1 trans-04 m-tb-10"
                        >
                        Continue Reading
                        <i class="fa fa-long-arrow-right m-l-9"></i>
                        </a>
                    </div>
                    </div>
                </div>
                `;
    
                // Append the blog HTML to the container
                blogContainer.append(blogHtml);
            };
    
            img.onerror = function () {
                console.error('Error loading image:', img.src);
            };
    
            // Set the image source to trigger loading
            img.src = 'http://localhost:8080/api/images/' + blog.image;
        });
    }
});