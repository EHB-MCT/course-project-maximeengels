$(function () {
    console.log('linked');
    //default setup
    let query;
    // let apiKey = 'rOvTXn3TqiyjQHhYyyFJH3m5Vv2td0hmbMquyE4y';
    //no apiKey needed apparently
    let id;

    $('#home').show();
    $('form').hide();
    $('#listOfImages').hide();
    getImages();
    getList();


    //Eventlisteners voor buttons
    $('#list').click(function () {
        $('#home').hide();
        $('form').hide();
        $('#listOfImages').show();
        getList();
    });
    $('#form').click(function () {
        $('#home').hide();
        $('form').show();
        $('#listOfImages').hide();
    });
    $('#homeButton').click(function () {
        $('#home').show();
        $('form').hide();
        $('#listOfImages').hide();
        getImages();
    });


    function getImages() {

        $('#search').keyup(function () {
            query = $('#search').val();
            console.log(query);

            $.ajax({
                url: `https://images-api.nasa.gov/search?q=${query}&media_type=image`,
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                console.log('DONE');
                $('#images').empty();
                console.log(data);
                console.log(data.collection.items.links);
                for (let images of data.collection.items) {
                    // console.log(images.links[0].href);
                    $('#images').append(`<img src="${images.links[0].href}"> </img>`);
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
            for (let b of data) {
                // let div = `<div id="${b.title}"></div>`;
                // $(div).append(`<strong>Titel: </strong> ${b.title} <br>`);
                // $(div).append(`<strong>Description: </strong> ${b.description} <br>`);
                // $(div).append(`<strong>Rating </strong> ${b.rating} <br>`);
                // $(div).append(`<button id="delete ${id}">Delete</button> <br> <hr>`);
                // $('#listOfImages').append(div);

                $('#listOfImages').append(`<strong>Titel: </strong> ${b.title} <br>`)
                .append(`<strong>Description: </strong> ${b.description} <br>`)
                .append(`<strong>Rating </strong> ${b.rating} <br>`)
                .append(`<button id="delete ${id}">Delete</button> <br> <hr>`);
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


    //Deleting objects from database
    //collection.deleteMany([]);
    $('#delete ' + id).click(function () {
        $(this).remove();
    });


});