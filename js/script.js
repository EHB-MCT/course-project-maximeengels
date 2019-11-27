$(function () {
    console.log('linked');
    //default setup
    let query;
    // let apiKey = 'rOvTXn3TqiyjQHhYyyFJH3m5Vv2td0hmbMquyE4y';
    //no apiKey needed apparently

    $('form').hide();
    $('.overlay').hide();
    getImages();


    function getImages() {

        $('#search').keyup(function () {
            query = $('#search').val();
            console.log(query);

            $.ajax({
                url: `https://images-api.nasa.gov/search?q=${query}`,
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                console.log('DONE');
                $('#images').empty();
                console.log(data);
                for (let images of data.collection.items) {
                    // console.log(images.links[0].href);
                    $('#images').append(`<div class="img" style="background-image: url('${images.links[0].href}')"> </div>`);
                }
            }).fail(function (er1, er2) {
                console.log(er1);
                console.log(er2);
            });
        });
    }


    function getList() {

        $.ajax({
            url: 'http://127.0.0.1:3000/api/getSavedImages',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('DONE');
            $('#listOfImages').empty();

            let overlayTitleDiv = $('<div>', {
                id: "overlayTitle"
            });
            overlayTitleDiv.append(`<h1>Saved stars</h1>`)
                .append(`<h2>A list of all your saved images.</h2>`);
            $('#listOfImages').append(overlayTitleDiv);

            for (let userSavedImg of data) {
                let savedImage = $('<div>', {
                    class: "card",
                    id: userSavedImg._id
                });
                savedImage.append(`<strong>Titel: </strong> ${userSavedImg.title} <br>`)
                    .append(`<strong>Rating </strong> ${userSavedImg.rating} <br>`)
                    .append(`<button class="delete" id="${userSavedImg._id}"> Delete </button> <br>`);
                $('#listOfImages').append(savedImage);
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
            description: $('#beschrijvinginput').val(),
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
    $('#listOfImages').on('click', '.update', function () {
        let imageId = $(this).attr('id');
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
    $('#listOfImages').on('click', '.delete', function () {
        let imageId = $(this).attr('id');
        console.log($(this).attr('id'));
        $.ajax({
            url: `http://127.0.0.1:3000/api/deleteImage/${imageId}`,
            method: 'POST'

        }).done(function () {
            console.log('Image Inserted!');

        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
        //removes image from page
        $('#' + imageId).remove();
    });


    //========================================ANIMATIONS==========================================//

    $("a").on('click', function (event) {

        if (this.hash !== "") {
            event.preventDefault();
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


    //====================================================OVERLAY=========================================================//

    $('#bookmark').click(function () {
        getList();
        document.getElementById("listOfImages").style.width = "500px";
    });

    $('#landing').click(function () {
        document.getElementById("listOfImages").style.width = "0";
    });



    //=====================================AUDIO=====================================//

    var audio = document.querySelector('audio');
    audio.volume = .3;

});