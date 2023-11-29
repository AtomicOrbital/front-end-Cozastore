$(document).ready(function () {
    var blogContainer = $('#blog-container');

    // Get the value of the 'date-filter' parameter from the URL
    var dateFilter = new URLSearchParams(window.location.search).get('date-filter');

    var tagFilter = new URLSearchParams(window.location.search).get('tag-filter');

    // Retrieve filteredBlogs from localStorage
    var filteredBlogs = JSON.parse(localStorage.getItem('filteredBlogs'));

    // Check if filteredBlogs is not null or undefined
    if (filteredBlogs) {
        setTimeout(function () {
            displayFilteredBlogs(filteredBlogs);
        }, 100);

        localStorage.removeItem('filteredBlogs');
    }

    // Query for blogs.
    $.ajax({
        url: 'http://localhost:8080/blogs',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                displayBlogs(response.data);
                displayTags(response.data);
                displaySortedBlogDates(response.data);
                if (dateFilter !== null) {
                    // Convert dateFilter to a Date object
                    var filterDate = new Date(dateFilter);
    
                    // Introduce a delay of 100 milliseconds
                    setTimeout(function () {
                        var filteredBlogs = response.data.filter(function (blog) {
                            // Assuming createDate is a Date object
                            var blogDate = new Date(blog.createDate);
    
                            // Compare the year, month, and day of the blogs
                            return (
                                blogDate.getFullYear() === filterDate.getFullYear() &&
                                blogDate.getMonth() === filterDate.getMonth()
                            );
                        });
    
                        // Call a function to display the filtered blogs (replace with your actual function)
                        displayFilteredBlogs(filteredBlogs);
                    }, 200);
                }
                if (tagFilter !== null) {
                    var tag = tagFilter;  
                    // Introduce a delay of 100 milliseconds
                    setTimeout(function () {
                        var filteredBlogs = response.data.filter(function (blog) {
                            var tagsArray = blog.tags.split(',');
                            return tagsArray.map(function (t) {
                                return t.trim();
                            }).includes(tag);
                        });
    
                        // Call a function to display the filtered blogs (replace with your actual function)
                        displayFilteredBlogs(filteredBlogs);
                    }, 200);
                }
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

                    displayFilteredBlogs(filteredBlogs);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error: ' + status + ' - ' + error);
            }
        });
        
    });

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

    function displayBlogs(blogs) {
        
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
                                <a href="blog-detail.html?blog-id=${blog.id}" class="hov-img0 how-pos5-parent">
                                <img src="${img.src}" alt="${blog.title}" />
                                <div class="flex-col-c-m size-123 bg9 how-pos5" id="dateContainer_${blog.id}">
                                <script type="text/javascript">
                                    var apiUrl = 'http://localhost:8080/blogs/' + ${blog.id};

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
                                    <span id="commentContainer_${blog.id}"> 0 Comments </span>
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
                
                // Add an event listener to the tag
                tagElement.addEventListener('click', function (event) {
                    event.preventDefault();

                    // Filter blogs based on the clicked tag and display them
                    var filteredBlogs = blogs.filter(function (blog) {
                        var tagsArray = blog.tags.split(',');
                        return tagsArray.map(function (t) {
                            return t.trim();
                        }).includes(tag);
                    });

                    // Call a function to display the filtered blogs (replace with your actual function)
                    displayFilteredBlogs(filteredBlogs);
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
                
                event.preventDefault();

                // Extract the text content of the clicked element
                var clickedDateText = liElement.textContent.trim();
                
                // Convert the text content to a Date object
                var targetDate = new Date(clickedDateText);

                // Filter blogs based on the clicked date
                var filteredBlogs = blogs.filter(function (blog) {
                    // Assuming createDate is a Date object
                    var blogDate = new Date(blog.createDate);

                    // Compare the year, month, and day of the blogs
                    return (
                        blogDate.getFullYear() === targetDate.getFullYear() &&
                        blogDate.getMonth() === targetDate.getMonth()
                    );
                });

                // Call a function to display the filtered blogs (replace with your actual function)
                displayFilteredBlogs(filteredBlogs);
            });
            sortedMonthsContainer.appendChild(liElement);    
        });
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
    
    function getRandomProducts(products, num) {
        var shuffledProducts = products.slice(); // Copy the array to avoid modifying the original
        for (var i = shuffledProducts.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
        }
        return shuffledProducts.slice(0, num);
    }
    
    function updateCommentsAmount(comments) {
        // Create an object to store the counts for each blog
        var blogCounts = {};
    
        // Iterate through the comments and count them for each blog
        comments.forEach(function (comment) {
            var blogId = comment.idBlog;
    
            // If the blogId is not in the counts object, initialize it to 1
            if (!blogCounts[blogId]) {
                blogCounts[blogId] = 1;
            } else {
                // Increment the count for the blogId
                blogCounts[blogId]++;
            }
        });
    
        // Log the counts for each blog
        for (var blogId in blogCounts) {
            var spanId = 'commentContainer_' + blogId;
            var commentContainer = document.getElementById(spanId);
            if (commentContainer) {
                // Update the content of the span with the new comment count
                commentContainer.textContent = blogCounts[blogId] + ' Comments';
            } else {
                console.error('Span element not found with ID:', spanId);
            }
        }
    }
});