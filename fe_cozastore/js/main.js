
(function ($) {
    "use strict";

    $(document).ready(function () {
    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
    }
    else {
        var posWrapHeader = 0;
    }
    

    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top',0); 
    }  
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
    }

    $(window).on('scroll',function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top',0); 
        }  
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
        } 
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') { console.log('hello');
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
                
        }
    });


    /*==================================================================
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({filter: filterValue});
        });
        
    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine : 'best-available',
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });
    });

    var isotopeButton = $('.filter-tope-group button');

    $(isotopeButton).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }    
    });

    $('.js-show-search').on('click',function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }    
    });




    /*==================================================================
    [ Cart ]*/
    $('.js-show-cart').on('click',function(){
        $('.js-panel-cart').addClass('show-header-cart');
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    
    /*==================================================================
    [ Show modal1 ]*/
    $('.js-show-modal1').on('click',function(e){
        e.preventDefault();
        $('.js-modal1').addClass('show-modal1');
    });

    $('.js-hide-modal1').on('click',function(){
        $('.js-modal1').removeClass('show-modal1');
    });

    // New added code.

    
    // Connections.
    var sortAscendingPriceButton = document.getElementById("sortAscendingPriceButton");
    
    sortAscendingPriceButton.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeMethodFilterHighlight(sortAscendingPriceButton);
        displayProducts(sortProductByPriceAscending(queried_products_list));
    });

    var sortDescendingPriceButton = document.getElementById("sortDescendingPriceButton");
    
    sortDescendingPriceButton.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeMethodFilterHighlight(sortDescendingPriceButton);
        displayProducts(sortProductByPriceDescending(queried_products_list));
    });

    var filterRangeButton1 = document.getElementById("filterRangeButton1");

    filterRangeButton1.addEventListener("click", function (event) {
        event.preventDefault();
        
        changePriceFilterHighlight(filterRangeButton1);
        displayProducts(filterProductsByRange(queried_products_list, 0, 9999999999));
    });

    var filterRangeButton2 = document.getElementById("filterRangeButton2");

    filterRangeButton2.addEventListener("click", function (event) {
        event.preventDefault();
        
        changePriceFilterHighlight(filterRangeButton2);
        displayProducts(filterProductsByRange(queried_products_list, 0, 50));
    });

    var filterRangeButton3 = document.getElementById("filterRangeButton3");

    filterRangeButton3.addEventListener("click", function (event) {
        event.preventDefault();
        
        changePriceFilterHighlight(filterRangeButton3);
        displayProducts(filterProductsByRange(queried_products_list, 50, 100));
    });

    var filterRangeButton4 = document.getElementById("filterRangeButton4");

    filterRangeButton4.addEventListener("click", function (event) {
        event.preventDefault();
    
        changePriceFilterHighlight(filterRangeButton4);
        displayProducts(filterProductsByRange(queried_products_list, 100, 150));
    });

    var filterRangeButton5 = document.getElementById("filterRangeButton5");

    filterRangeButton5.addEventListener("click", function (event) {
        event.preventDefault();
    
        changePriceFilterHighlight(filterRangeButton5);
        displayProducts(filterProductsByRange(queried_products_list, 150, 200));
    });

    var filterRangeButton6 = document.getElementById("filterRangeButton6");

    filterRangeButton6.addEventListener("click", function (event) {
        event.preventDefault();
        
        changePriceFilterHighlight(filterRangeButton6);
        displayProducts(filterProductsByRange(queried_products_list, 200, 9999999999));
    });

    var filterCategoryButton1 = document.getElementById("filterCategoryButton1");

    filterCategoryButton1.addEventListener("click", function (event) {
        event.preventDefault();
    
        displayProducts(filterProductsByCategory(queried_products_list, 0));
    });

    var filterCategoryButton2 = document.getElementById("filterCategoryButton2");

    filterCategoryButton2.addEventListener("click", function (event) {
        event.preventDefault();
    
        displayProducts(filterProductsByCategory(queried_products_list, 2));
    });

    var filterCategoryButton3 = document.getElementById("filterCategoryButton3");

    filterCategoryButton3.addEventListener("click", function (event) {
        event.preventDefault();
    
        displayProducts(filterProductsByCategory(queried_products_list, 1));
    });

    var filterCategoryButton4 = document.getElementById("filterCategoryButton4");

    filterCategoryButton4.addEventListener("click", function (event) {
        event.preventDefault();
    
        displayProducts(filterProductsByCategory(queried_products_list, 3));
    });

    var filterCategoryButton5 = document.getElementById("filterCategoryButton5");

    filterCategoryButton5.addEventListener("click", function (event) {
        event.preventDefault();
    
        displayProducts(filterProductsByCategory(queried_products_list, 4));
    });

    var filterCategoryButton6 = document.getElementById("filterCategoryButton6");

    filterCategoryButton6.addEventListener("click", function (event) {
        event.preventDefault();
    
        displayProducts(filterProductsByCategory(queried_products_list, 5));
    });

    var filterColorButton1 = document.getElementById("filterColorButton1");

    filterColorButton1.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeColorFilterHighlight(filterColorButton1);
        displayProducts(filterProductsByColor(queried_products_list, 4));
    });

    var filterColorButton2 = document.getElementById("filterColorButton2");

    filterColorButton2.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeColorFilterHighlight(filterColorButton2);
        displayProducts(filterProductsByColor(queried_products_list, 2));
    });

    var filterColorButton3 = document.getElementById("filterColorButton3");

    filterColorButton3.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeColorFilterHighlight(filterColorButton3);
        displayProducts(filterProductsByColor(queried_products_list, 5));
    });

    var filterColorButton4 = document.getElementById("filterColorButton4");

    filterColorButton4.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeColorFilterHighlight(filterColorButton4);
        displayProducts(filterProductsByColor(queried_products_list, 3));
    });

    var filterColorButton5 = document.getElementById("filterColorButton5");

    filterColorButton5.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeColorFilterHighlight(filterColorButton5);
        displayProducts(filterProductsByColor(queried_products_list, 1));
    });

    var filterColorButton6 = document.getElementById("filterColorButton6");

    filterColorButton6.addEventListener("click", function (event) {
        event.preventDefault();
        
        changeColorFilterHighlight(filterColorButton6);
        displayProducts(filterProductsByColor(queried_products_list, 8));
    });

    var queried_products_list;
    var queried_product_details_list;

    $.ajax({
        url: 'http://localhost:8080/product',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                // Process the data and update the HTML
                queried_products_list = response.data;
                displayProducts(queried_products_list);
                displayTags(queried_products_list);
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    $.ajax({
        url: 'http://localhost:8080/product-details',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.statusCode === 200) {
                // Process the data and update the HTML
                queried_product_details_list = response.data;
            } else {
                console.error('Error: ' + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + status + ' - ' + error);
        }
    });

    function sortProductByPriceDescending(product_list) {
        // Sort the products by price in descending order
        product_list.sort(function (a, b) {
            return b.price - a.price;
        });
    
        // Return the sorted list
        return product_list;
    }

    function sortProductByPriceAscending(product_list) {
        // Sort the products by price in descending order
        product_list.sort(function (a, b) {
            return a.price - b.price;
        });
    
        // Return the sorted list
        return product_list;
    }

    function filterProductsByRange(product_list, lower_bound, upper_bound) {
        return product_list.filter(function (product) {
            return product.price >= lower_bound && product.price <= upper_bound;
        });
    }

    function filterProductsByCategory(product_list, category_id) {
        if (category_id == 0){
            return product_list;
        }
        return product_list.filter(function (product) {
            return product.idCategory == category_id;
        });
    }

    function filterProductDetailsByColor(product_details_list, color_id) {
        return product_details_list.filter(function (product) {
            return product.idColor == color_id;
        });
    }

    function filterProductsByColor(product_list, color_id){
        var temp_product_details_list = queried_product_details_list;

        var products_to_lookup = filterProductDetailsByColor(temp_product_details_list, color_id);
        const ids_to_lookip = products_to_lookup.map(product => product.idProduct);

        console.log(ids_to_lookip);

        return product_list.filter(function (product) {
            return ids_to_lookip.includes(product.id);
        });
    }

    function changeColorFilterHighlight(selected_button){
        const filterButtons = document.querySelectorAll('.filter-link-color');

        filterButtons.forEach(function(button) {
            button.classList.remove('filter-link-active');
        });

        selected_button.classList.add('filter-link-active');
    }

    function changePriceFilterHighlight(selected_button){
        const filterButtons = document.querySelectorAll('.filter-link-price');

        filterButtons.forEach(function(button) {
            button.classList.remove('filter-link-active');
        });

        selected_button.classList.add('filter-link-active');
    }

    function changeMethodFilterHighlight(selected_button){
        const filterButtons = document.querySelectorAll('.filter-link-method');

        filterButtons.forEach(function(button) {
            button.classList.remove('filter-link-active');
        });

        selected_button.classList.add('filter-link-active');
    }

    function displayProducts(products) {
        var productContainer = $('#product-container');
    
        productContainer.empty(); // Reset

        products.forEach(function (product) {
            // Create HTML elements for each product
            var productHtml = `
                <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.idCategory}">
                    <div class="block2">
                        <div class="block2-pic hov-img0">
                            <img src="http://localhost:8080/api/images/${product.images}" alt="${product.title}" />
                            <a href="#" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                                Quick View
                            </a>
                        </div>
                        <div class="block2-txt flex-w flex-t p-t-14">
                            <div class="block2-txt-child1 flex-col-l">
                                <a href="product-detail.html" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                    ${product.title}
                                </a>
                                <span class="stext-105 cl3"> $${product.price} </span>
                            </div>
                            <div class="block2-txt-child2 flex-r p-t-3">
                                <a href="#" class="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                    <img class="icon-heart1 dis-block trans-04" src="images/icons/icon-heart-01.png" alt="ICON" />
                                    <img class="icon-heart2 dis-block trans-04 ab-t-l" src="images/icons/icon-heart-02.png" alt="ICON" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            productContainer.append(productHtml);

        });

        var isotopeItems = document.querySelectorAll('.isotope-item');

        // Remove the inline styles from each element
        isotopeItems.forEach(function(item) {
            item.style.position = '';
            item.style.left = '';
            item.style.top = '';
        });
    }

    function displayTags(products) {
        var uniqueTags = [];

        products.forEach(function (product) {
            var tagsArray = product.tags.split(',');

            tagsArray.forEach(function (tag) {
                var trimmedTag = tag.trim();

                if (!uniqueTags.includes(trimmedTag)) {
                    uniqueTags.push(trimmedTag);
                }
            });
        });

        var tagsContainer = document.getElementById('tagsContainer');

        if (tagsContainer) {
            uniqueTags.forEach(function (tag) {
                var tagElement = document.createElement('a');
                tagElement.href = '#';
                tagElement.className = 'flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5';
                tagElement.textContent = tag;
                
                tagElement.addEventListener('click', function (event) {
                    event.preventDefault();

                    var filteredProducts = products.filter(function (product) {
                        var tagsArray = product.tags.split(',');
                        return tagsArray.map(function (t) {
                            return t.trim();
                        }).includes(tag);
                    });

                    displayProducts(filteredProducts);
                });
                tagsContainer.appendChild(tagElement);
            });
        }
    }
    });
})(jQuery);