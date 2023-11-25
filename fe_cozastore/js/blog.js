$(document).ready(function () {
    var blogContainer = $('#blog-container');
    $.ajax({
        url: 'http://localhost:8080/blogs',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                displayBlog(response.data);
                displayTags(response.data);
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
                // Make an AJAX request to get user details
                $.ajax({
                    url: 'http://localhost:8080/user/' + blog.idUser,
                    type: 'GET',
                    dataType: 'json',
                    success: function (userResponse) {
                        
                
                        // Create HTML elements for each blog
                        var blogHtml = `
                            <div class="p-b-63">
                                <a href="blog-detail.html" class="hov-img0 how-pos5-parent">
                                <img src="${img.src}" alt="${blog.title}" />
                                <div class="flex-col-c-m size-123 bg9 how-pos5" id="dateContainer_${blog.id}">
                                <script type="text/javascript">
                                    var apiUrl = 'http://localhost:8080/blogs/' + ${blog.idUser};

                                    fetch(apiUrl)
                                        .then(response => response.json())
                                        .then(userData => {
                                            // Convert the string to a JavaScript Date object
                                            var createDate = new Date(userData.data.createDate);

                                            var monthNames = [
                                                'JAN', 'FEB', 'MAR', 'APR', 'MAT', 'JUN',
                                                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
                                            ];

                                            // Extract the year, month, and date
                                            var year = createDate.getFullYear();
                                            var month = createDate.getMonth() + 1; // Months are zero-based, so add 1
                                            var date = createDate.getDate();

                                            var monthName = monthNames[month - 1]; // Subtract 1 because months are zero-based

                                            // Create HTML for the new <span> element
                                            var newSpanHTML =   '<span class="ltext-107 cl2 txt-center">' + date + '</span>' + 
                                                                '<span class="stext-109 cl3 txt-center">' + monthName + ' ' + year + '</span>';

                                            // Insert the new <span> element after the first <span> in the specific parent container
                                            var parentContainer = document.getElementById('dateContainer_${blog.id}');
                                            if (parentContainer) {
                                                parentContainer.insertAdjacentHTML('afterbegin', newSpanHTML);
                                            }
                                        })
                                        .catch(err => {
                                            // Handle the error here
                                            console.error('Error fetching user data:', err);
                                        });
                                </script>

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
                                <div class="flex-w flex-sb-m p-t-18" id="userContainer_${blog.id}">
                                    <span class="flex-w flex-m stext-111 cl2 p-r-30 m-tb-10">
                                    <span>

                                    
                                    <script type="text/javascript">
                                        var apiUrl = 'http://localhost:8080/user/' + ${blog.idUser};

                                        fetch(apiUrl)
                                            .then(response => response.json())
                                            .then(userData => {

                                                // Create HTML for the new <span> element
                                                var newSpanHTML = '<span class="cl4">' + userData.data.username + '</span>';

                                                // Insert the new <span> element after the first <span> in the specific parent container
                                                var parentContainer = document.getElementById('userContainer_${blog.id}');
                                                if (parentContainer) {
                                                    parentContainer.insertAdjacentHTML('afterbegin', newSpanHTML);
                                                }
                                            })
                                            .catch(err => {
                                                // Handle the error here
                                                console.error('Error fetching user data:', err);
                                            });
                                    </script>



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
                    },
                    error: function (xhr, status, error) {
                        console.error('Error getting user details:', status, error);
                    }
                });
            };
    
            img.onerror = function () {
                console.error('Error loading image:', img.src);
            };
    
            // Set the image source to trigger loading
            img.src = 'http://localhost:8080/api/images/' + blog.image;
        });
    }
    
    function displayTags(blogs) {
        var uniqueTags = [];

        // Iterate through each blog
        blogs.forEach(function (blog) {
            // Split the tags into an array using commas as separators
            var tagsArray = blog.tags.split(',');

            // Trim whitespaces and add each tag to the uniqueTags list
            tagsArray.forEach(function (tag) {
                var trimmedTag = tag.trim();

                // Add the tag to the list only if it's not already present
                if (!uniqueTags.includes(trimmedTag)) {
                    uniqueTags.push(trimmedTag);
                }
            });
        });

        // Get the element with the ID "tagsContainer"
        var tagsContainer = document.getElementById('tagsContainer');

        // Check if the container element exists
        if (tagsContainer) {
            // Iterate through unique tags and create <a> tags
            uniqueTags.forEach(function (tag) {
                // Create a new <a> tag
                var tagElement = document.createElement('a');
                tagElement.href = '#';
                tagElement.className = 'flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5';
                tagElement.textContent = tag;

                // Append the <a> tag to the tagsContainer
                tagsContainer.appendChild(tagElement);
            });
        }
        }
});