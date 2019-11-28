$(function () {
    console.log('linked');
    //default setup
    let query;
    // let apiKey = 'rOvTXn3TqiyjQHhYyyFJH3m5Vv2td0hmbMquyE4y';
    //no apiKey needed apparently

    $('form').hide();
    $('#images').hide();
    getImages();


    function getImages() {

        $('#search').keyup(function () {
            query = $('#search').val();
            console.log(query);

            if (query == "") {
                $('#images').fadeOut('slow');
            } else {

                $.ajax({
                    url: `https://images-api.nasa.gov/search?q=${query}`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    console.log('DONE');
                    $('#images').empty();
                    console.log(data);
                    let i = 1;
                    for (let images of data.collection.items) {
                        $('#images').append(`<div class="img" id="${i}" style="background-image: url('${images.links[0].href}')">
                    <i class="far fa-bookmark bookmarkStyle" id="bookmark${i}"></i>
                    <form id="form${i}">
                    <input type="text" class="form-control" id="titelinput" name="titel">
                    <input type="number" class="form-control" id="ratinginput" name="rating" step="1">
                    </form>
                    </div>`);
                        i++;
                    }
                    $('#images i').hide();
                    $('#images form').hide();
                    $('#images').fadeIn('slow');

                }).fail(function (er1, er2) {
                    console.log(er1);
                    console.log(er2);
                });
            }
        });
    }


    function getList() {

        $.ajax({
            url: 'http://127.0.0.1:3000/api/getSavedImages',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('DONE');
            $('#savedImages').empty();

            let overlayTitleDiv = $('<div>', {
                id: "overlayTitle"
            });
            overlayTitleDiv.append(`<h1>Saved stars</h1>`)
                .append(`<h2>A list of all your saved images.</h2>`);
            $('#savedImages').append(overlayTitleDiv);

            for (let userSavedImg of data) {
                let savedImage = $('<div>', {
                    class: "card",
                    id: userSavedImg._id
                });
                savedImage.append(`${userSavedImg.title} <br>`)
                    .append(`${userSavedImg.rating} <br>`)
                    .append(`<button class="delete" id="${userSavedImg._id}"> Delete </button> <br>`);
                $('#savedImages').append(savedImage);
            }

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    }

    //Saving objects to database
    $('form').submit(function (e) {
        //standard behaviour block
        e.preventDefault();

        //Get all data from form with jQuery
        console.log($('#titelinput').val());

        let imageObject = {
            title: $('#titelinput').val(),
            rating: $('#ratinginput').val()
        };

        //Call to server
        $.ajax({
            url: 'http://127.0.0.1:3000/api/insertImage',
            method: 'POST',
            data: imageObject

        }).done(function (data) {
            console.log('Image Inserted!');

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    });

    //Updating objects from database
    $('#savedImages').on('click', '.update', function () {
        let savedImageId = $(this).attr('id');
        console.log($(this).attr('id'));
        $.ajax({
            url: `http://127.0.0.1:3000/api/updateImage`,
            method: 'PUT'

        }).done(function () {
            console.log('Image Inserted!');

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });

        //removes image from page
        // $('#' + imageId).remove();
    });

    //Deleting objects from database
    $('#savedImages').on('click', '.delete', function () {
        let savedImageId = $(this).attr('id');
        $.ajax({
            url: `http://127.0.0.1:3000/api/deleteImage/${savedImageId}`,
            method: 'POST'

        }).done(function () {
            console.log('Image Inserted!');

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
        //removes image from page
        $('#' + savedImageId).remove();
    });


    //========================================ANIMATIONS==========================================//

    //BACK-TO-TOP
    $('a').on('click', function (e) {
        if (this.hash !== "") {
            e.preventDefault();
            let hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {

                // Add hash (#) to URL when done scrolling
                window.location.hash = hash;
            });
        }
    });

    //IMAGES
    $('#images').on('click', '.img', function () {
        let imageId = $(this).attr('id');
        console.log(imageId);
        $('#images #bookmark' + imageId).fadeIn('150');
        $('#images #form' + imageId).fadeIn('150');
    });

    //FORM
    $('i').on('mouseenter', function () {
        $('i').removeClass("far").addClass("fas");
    });

    $('.img .bookmarkStyle').on('click', function () {
        let imageId = $(this).attr('id');
        console.log('clicked this bookmark');
        $('#images #form' + imageId).show();
        // $('#images #form' + imageId).css("display", "true");
    });


    //====================================================OVERLAY=========================================================//

    $('#mainBookmark').click(function () {
        getList();
        document.getElementById("savedImages").style.width = "50%";
    });

    $('#landing').click(function () {
        document.getElementById("savedImages").style.width = "0";
    });



    //=====================================AUDIO=====================================//

    // var audio = document.querySelector('audio');
    // audio.volume = .3;

});