$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);

    const blogId = urlParams.get('blog-id');
    console.log(blogId);

    $.ajax({
        url: 'http://localhost:8080/blogs/' + blogId,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                displayBlog(response.data);
                var miniTitleContainer = document.getElementById('mini-blog-title');
                miniTitleContainer.textContent = response.data.title;
                displayBlogTags(response.data);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    // Query for comments. And then modify the comment values under the blogs
    $.ajax({
        url: 'http://localhost:8080/comments',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                // Process the data and update the HTML
                setTimeout(function () {
                    // Process the data and update the HTML after the delay
                    updateCommentsAmount(response.data);
                }, 100);
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    // Query for products. (Random display)
    $.ajax({
        url: 'http://localhost:8080/product',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                // Process the data and update the HTML
                displayRandomProducts(response.data);
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    // Query for categories.
    $.ajax({
        url: 'http://localhost:8080/category',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                // Process the data and update the HTML
                displayCategories(response.data);
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    // Query for blogs.
    $.ajax({
        url: 'http://localhost:8080/blogs',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                displayTags(response.data);
                displaySortedBlogDates(response.data);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    setTimeout(function () {
        document.getElementById('postCommentButton').addEventListener('click', function (event) {
            event.preventDefault();
    
            var commentData = {
                name: document.getElementById('name-comment-field').value,
                content: document.getElementById('content-comment-field').value,
                email: document.getElementById('email-comment-field').value,
                website: document.getElementById('website-comment-field').value,
                idBlog: blogId,
            };
    
            $.ajax({
                url: 'http://localhost:8080/comments',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(commentData),
                success: function (data) {
                    console.log('Comment posted successfully:', data);
                },
                error: function (error) {
                    console.error('Error posting comment:', error);
                }
            });
        });
    }, 150);

    document.getElementById('searchButton').addEventListener('click', function () {
        // Query for blogs.
        $.ajax({
            url: 'http://localhost:8080/blogs',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.statusCode === 200) {
                    // Get the value from the search input
                    var searchKeyword = document.getElementById('searchInput').value.trim().toLowerCase();

                    // Filter blogs based on the search keyword
                    var filteredBlogs = response.data.filter(function (blog) {
                        return blog.title.toLowerCase().includes(searchKeyword);
                    });

                    // Store the filteredBlogs in localStorage
                    localStorage.setItem('filteredBlogs', JSON.stringify(filteredBlogs));

                    // Redirect to blog.html
                    window.location.href = 'http://127.0.0.1:5500/blog.html';
                }
            },
            error: function (xhr, status, error) {
                console.error('Error: ' + status + ' - ' + error);
            }
        });
        
    });

    function displayBlog(blog) {
        var blogContainer = $('#blog-container');
        
        var createDate = new Date(blog.createDate);

        var monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Extract the year, month, and date
        var year = createDate.getFullYear();
        var month = createDate.getMonth() + 1; // Months are zero-based, so add 1
        var date = createDate.getDate();

        var monthName = monthNames[month - 1]; // Subtract 1 because months are zero-based

                                            

        var blogHtml = `
            <div class="wrap-pic-w how-pos5-parent">
                <img src="http://localhost:8080/api/images/${blog.image}" alt="${blog.title}" />
                <div class="flex-col-c-m size-123 bg9 how-pos5">
                
                <span class="ltext-107 cl2 txt-center"> ${date} </span>
                <span class="stext-109 cl3 txt-center"> ${monthName} ${year}</span>
                </div>
            </div>
            <div class="p-t-32">
                <span class="flex-w flex-m stext-111 cl2 p-b-19">
                <span>
                    <span class="cl4">By</span> 
                    <span id="userContainer_${blog.id}"> null </span>
                    <script type="text/javascript">
                        var apiUrl = 'http://localhost:8080/user/' + ${blog.idUser};

                        fetch(apiUrl)
                            .then(response => response.json())
                            .then(userData => {

                                var parentContainer = document.getElementById('userContainer_${blog.id}');
                                parentContainer.textContent = userData.data.username;
                            })
                            .catch(err => {
                                // Handle the error here
                                console.error('Error fetching user data:', err);
                            });
                    </script>
                    <span class="cl12 m-l-4 m-r-6">|</span>
                </span>
                <span>
                    ${date} ${monthName}, ${year}
                    <span class="cl12 m-l-4 m-r-6">|</span>
                </span>
                <span id="blogTagsContainer">
                    ${blog.tags}
                    <span class="cl12 m-l-4 m-r-6">|</span>
                </span>
                <span id="commentContainer"> 8 Comments </span>
                </span>
                <h4 class="ltext-109 cl2 p-b-28">
                    ${blog.title}
                </h4>
                <p class="stext-117 cl6 p-b-26">
                <i>
                    ${blog.content}
                </i>
                </p>
                <p class="stext-117 cl6 p-b-26" style="text-align: justify;">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis varius massa. In hac habitasse platea dictumst. Sed rhoncus, elit at tincidunt consectetur, justo libero gravida tellus, nec varius ex massa vel mauris. Ut eleifend urna vitae tortor tincidunt, a vestibulum risus tempor. Aenean et dolor ut purus imperdiet euismod. Nullam venenatis odio sit amet justo ullamcorper, vel fermentum dui dignissim. Curabitur ultrices risus ut aliquet bibendum. Integer tincidunt ex a ligula consequat, vel eleifend augue ultricies. Curabitur non quam ut tellus vehicula vulputate. Vivamus luctus eleifend nisi, in blandit mauris tristique sit amet. Maecenas ut tellus massa. Integer eget commodo justo. Sed ac ullamcorper lectus. Aenean gravida nec libero ac tincidunt. Sed ultrices nisl id turpis ultrices, at consequat dui consequat. Mauris non erat non purus efficitur convallis.
                </p>
            </div>
            <div class="flex-w flex-t p-t-16">
                <span class="size-216 stext-116 cl8 p-t-4"> Tags </span>
                <div class="flex-w size-217" id="blogTagsContainer2">
                </div>
            </div>
            <div class="p-t-40">
              <h5 class="mtext-113 cl2 p-b-12">Leave a Comment</h5>
              <p class="stext-107 cl6 p-b-40">
                Your email address will not be published. Required fields are
                marked *
              </p>
              <form>
                <div class="bor19 m-b-20">
                  <textarea
                    class="stext-111 cl2 plh3 size-124 p-lr-18 p-tb-15"
                    name="cmt"
                    placeholder="Comment..."
                    id="content-comment-field"
                  >Input your comment here</textarea>
                </div>
                <div class="bor19 size-218 m-b-20">
                  <input
                    class="stext-111 cl2 plh3 size-116 p-lr-18"
                    type="text"
                    name="name"
                    id="name-comment-field"
                    value="Name *"
                  />
                </div>
                <div class="bor19 size-218 m-b-20">
                  <input
                    class="stext-111 cl2 plh3 size-116 p-lr-18"
                    type="text"
                    name="email"
                    id="email-comment-field"
                    value="Email *"
                  />
                </div>
                <div class="bor19 size-218 m-b-30">
                  <input
                    class="stext-111 cl2 plh3 size-116 p-lr-18"
                    type="text"
                    name="web"
                    id="website-comment-field"
                    value="Website"
                  />
                </div>
                <button
                type="button"
                  class="flex-c-m stext-101 cl0 size-125 bg3 bor2 hov-btn3 p-lr-15 trans-04"
                  id="postCommentButton"
                >
                  Post Comment
                </button>
              </form>
            </div>
        `;

        blogContainer.append(blogHtml);
    }

    function updateCommentsAmount(comments) {
        // Create an object to store the counts for each blog
        var blogCounts = {};
    
        // Iterate through the comments and count them for each blog
        comments.forEach(function (comment) {
            var blogid = comment.idBlog;
    
            // If the blogId is not in the counts object, initialize it to 1
            if (!blogCounts[blogid]) {
                blogCounts[blogid] = 1;
            } else {
                // Increment the count for the blogId
                blogCounts[blogid]++;
            }
        });
    
        var parentContainer = document.getElementById('commentContainer');
        if (!blogCounts[blogId]) {
            blogCounts[blogId] = 0;
        }
        parentContainer.textContent = blogCounts[blogId] + ' Comments';        
    }

    function displayBlogTags(blog) {
        var uniqueTags = [];

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

        // Get the element with the ID "tagsContainer"
        var tagsContainer = $('#blogTagsContainer2');

        // Check if the container element exists
        if (tagsContainer) {
            // Iterate through unique tags and create <a> tags
            uniqueTags.forEach(function (tag) {
                var tagHtml =   `<a
                                    href="#"
                                    class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                                >
                                    ${tag}
                                </a>`;
                tagsContainer.append(tagHtml);
            });
        }
    }

    function getRandomProducts(products, num) {
        var shuffledProducts = products.slice(); // Copy the array to avoid modifying the original
        for (var i = shuffledProducts.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
        }
        return shuffledProducts.slice(0, num);
    }

    function displayRandomProducts(products) {
        var productContainer = $('#featured-product-container'); // Replace with your actual container ID
        
        var randomProducts = getRandomProducts(products, 3);
        randomProducts.forEach(function (product) {
            // Create an Image object to load the image
            var img = new Image();
            img.crossOrigin="anonymous"
    
            // Set up the onload and onerror handlers
            img.onload = function () {
                // Create a canvas element for resizing
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
    
                // Set the canvas dimensions to the desired size
                canvas.width = 90;
                canvas.height = 110;
    
                // Draw the image on the canvas with the desired dimensions
                ctx.drawImage(img, 0, 0, 90, 110);
    
                // Get the resized image as a data URL
                var resizedImgUrl = canvas.toDataURL();
    
                // Create HTML elements for each product
                var productHtml = `
                    <li class="flex-w flex-t p-b-30">
                        <a href="#" class="wrap-pic-w size-214 hov-ovelay1 m-r-20">
                            <img src="${resizedImgUrl}" alt="${product.title}" />
                        </a>
                        <div class="size-215 flex-col-t p-t-8">
                            <a href="#" class="stext-116 cl8 hov-cl1 trans-04">
                                ${product.title}
                            </a>
                            <span class="stext-116 cl6 p-t-20"> $${product.price} </span>
                        </div>
                    </li>
                `;
    
                // Append the product HTML to the container
                productContainer.append(productHtml);
            };
    
            img.onerror = function () {
                console.error('Error loading image:', img.src);
            };
    
            // Set the image source to trigger loading
            img.src = 'http://localhost:8080/api/images/' + product.images;
        });
    }

    function displayCategories(categories) {
        // Get the element with the ID "categories-container"
        var categoriesContainer = document.getElementById('categories-container');
    
        // Check if the container element exists
        if (categoriesContainer) {
            // Iterate through categories and create <li> elements
            categories.forEach(function (category) {
                // Create a new <li> element
                var liElement = document.createElement('li');
                liElement.className = 'bor18';
    
                // Create a new <a> element
                var aElement = document.createElement('a');
                aElement.href = '#';
                aElement.className = 'dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4';
                aElement.textContent = category.name;
    
                // Append the <a> element to the <li> element
                liElement.appendChild(aElement);
    
                // Append the <li> element to the categoriesContainer
                categoriesContainer.appendChild(liElement);
            });
        }
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
                
                // Add an event listener to the tag
                tagElement.addEventListener('click', function (event) {
                    event.preventDefault();

                    var redirectUrl = "http://127.0.0.1:5500/blog.html?tag-filter=" + tag;

                    // Set window.location.href to the redirect URL
                    window.location.href = redirectUrl;
                });
                // Append the <a> tag to the tagsContainer
                tagsContainer.appendChild(tagElement);
            });
        }
    }

    function displayFilteredBlogs(filteredBlogs) {
        // Clear the existing blogs on the page (replace this with your actual implementation)
        blogContainer.empty();
    
        // Display the filtered blogs (replace this with your actual implementation)
        displayBlogs(filteredBlogs);
    }

    function displaySortedBlogDates(blogs) {
        // Create an object to store blogs grouped by month
        var blogsByMonth = {};
        var monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // Iterate through each blog
        blogs.forEach(function (blog) {
            var createDate = new Date(blog.createDate);
    
            var year = createDate.getFullYear();
            var month = createDate.getMonth() + 1;

            var monthName = monthNames[month - 1];
            
            var key = monthName + ' ' + year;
    
            // Check if the key already exists, if not, create an empty array
            if (!blogsByMonth[key]) {
                blogsByMonth[key] = [];
            }
    
            // Add the blog to the array corresponding to the key
            blogsByMonth[key].push(blog);
        });
    
        var sortedMonths = Object.keys(blogsByMonth).sort(function (a, b) {
            // Convert keys to Date objects for comparison
            var dateA = new Date(a);
            var dateB = new Date(b);
        
            // Compare dates
            return dateB - dateA;
        });
    
        sortedMonths.forEach(function (key) {
            // Create a new <li> element
            var liElement = document.createElement('li');
            liElement.className = 'p-b-7';

            // Create a new <a> element
            var aElement = document.createElement('a');
            aElement.className = 'flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2';

            // Create a new <span> element for the month and add it to the <a> element
            var monthSpan = document.createElement('span');
            monthSpan.textContent = key;
            aElement.appendChild(monthSpan);

            // Create a new <span> element for the count (number of blogs) and add it to the <a> element
            var countSpan = document.createElement('span');
            countSpan.textContent = ' (' + blogsByMonth[key].length + ')';
            aElement.appendChild(countSpan);

            // Add the <a> element to the <li> element
            liElement.appendChild(aElement);

            // Append the <li> to the existing <ul> container
            liElement.addEventListener('click', function (event) {
                
                // Assuming 'redirectUrl' is the URL you want to redirect to
                var redirectUrl = "http://127.0.0.1:5500/blog.html?date-filter=" + key; // Replace with your desired URL

                // Set window.location.href to the redirect URL
                window.location.href = redirectUrl;
            });
            sortedMonthsContainer.appendChild(liElement);    
        });
    }
});