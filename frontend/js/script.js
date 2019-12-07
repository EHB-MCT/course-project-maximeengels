$(function () {
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

            if (query == "") {
                $('#images').fadeOut('slow');
            } else {

                $.ajax({
                    url: `https://images-api.nasa.gov/search?q=${query}`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function (data) {
                    $('#images').empty();
                    let i = 1;
                    for (let images of data.collection.items) {
                        let img = $('<div>', {
                            class: "img",
                            id: i,
                            style: `background-image: url('${images.links[0].href}')`
                        });
                        img.append(`<i class="far fa-bookmark bookmarkStyle" id="bookmark${i}"></i>`);
                        let form = $(`<form id="form${i}" action="#"></form>`)
                            .append(`<input type="text" id="titelinput${i}" name="titel" placeholder="title">`)
                            .append(`<input type="number" id="ratinginput${i}" name="rating" min="1" max="5" step="1" placeholder="1">`)
                            .append(`<button type="submit" id="submitButton">Submit</button>`);
                        i++;
                        img.append(form);
                        $('#images').append(img);
                    }

                    //Saving objects to database
                    $('form #submitButton').click(function (e) {
                        //standard behaviour block
                        e.preventDefault();
                        
                        //Get all data from form with jQuery
                        let bg = $(this).parent('form').parent('.img').css('background-image');
                        let formId = $(this).parent('form').parent('.img').attr('id');
                        let imageObject = {
                            title: $('#titelinput' + formId).val(),
                            rating: $('#ratinginput' + formId).val(),
                            href: bg
                        };

                        //Call to server
                        $.ajax({
                            url: 'http://127.0.0.1:3000/api/insertImage',
                            method: 'POST',
                            data: imageObject

                        }).done(function (data) {
                            console.log('Image Inserted!');
                            $('#mainBookmark').fadeOut('slow');
                            $('#mainBookmark').fadeIn('slow');
                        }).fail(function (er1, er2) {
                            console.log(er1);
                            console.log(er2);
                        });
                    });

                    //========================================ANIMATIONS============================================//
                    //IMAGES
                    $('.img').on('mouseenter', function () {
                        let imageId = $(this).attr('id');
                        let bookmark = $('#images #bookmark' + imageId);
                        $(bookmark).fadeIn('fast');

                        $(bookmark).on('click', function () {
                            $('#form' + imageId).fadeIn('fast');
                            if ($(bookmark).hasClass('far')) {
                                $(bookmark).removeClass("far").addClass("fas");
                            } else if ($(bookmark).hasClass('fas')) {
                                $(bookmark).removeClass("fas").addClass("far");
                            }
                        });
                    });

                    $('.img').on('mouseleave', function () {
                        let imageId = $(this).attr('id');
                        let bookmark = $('#images #bookmark' + imageId);
                        $(bookmark).fadeOut('fast');
                        $('#form' + imageId).fadeOut('fast');
                        $(bookmark).removeClass("fas").addClass("far");
                    });

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


    //=======================================OVERLAY===============================================//
    function getList() {

        $.ajax({
            url: 'http://127.0.0.1:3000/api/getSavedImages',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('DONE');
            $('#savedImages').empty();

            let overlayImageDiv = $('<div>', {
                id: "overlayImages"
            });
            let overlayTitleDiv = $('<div>', {
                id: "overlayTitle"
            });

            overlayTitleDiv.append(`<i class="fas fa-times"></i>`)
                .append(`<h1>Saved stars</h1>`)
                .append(`<h2>A list of all your saved images.</h2>`);
            $('#savedImages').append(overlayTitleDiv);

            for (let userSavedImg of data) {
                let savedImage = $('<div>', {
                    class: "card",
                    id: userSavedImg._id,
                    style: `background-image: ${userSavedImg.href}`
                });
                savedImage.append(`<p>${userSavedImg.title}</p>`)
                    .append(`<p>${userSavedImg.rating}</p>`)
                    .append(`<button class="delete" id="${userSavedImg._id}"> Delete </button>`);
                overlayImageDiv.append(savedImage);
            }
            $('#savedImages').append(overlayImageDiv);

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    }



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
        $('#' + savedImageId).fadeOut();
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

    //OVERLAY ANIMATIONS

    $('#mainBookmark').click(function () {
        getList();
        document.getElementById("savedImages").style.width = "60%";
    });

    $('#savedImages').on('click', '.fa-times', function () {
        document.getElementById("savedImages").style.width = "0";
    });

    $('#landing').click(function () {
        document.getElementById("savedImages").style.width = "0";
    });

    $('.card').on('mouseenter', function () {
        let cardId = $(this).attr('id');
        $(cardId).fadeIn('fast');
    });


    //=====================================AUDIO=====================================//

    var audio = document.querySelector('audio');
    audio.volume = .2;

});