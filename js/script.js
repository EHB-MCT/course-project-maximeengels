$(function () {
    console.log('linked');
    //default setup
    $('form').hide();
    $('#listOfImages').show();
    getList();


    //Eventlisteners voor buttons
    $('#list').click(function () {
        $('form').hide();
        $('#listOfImages').show();
        getList();
    });
    $('#form').click(function () {
        $('form').show();
        $('#listOfImages').hide();
    });


    function getList() {

        $.ajax({
            url: 'http://127.0.0.1:3000/getImages',
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            console.log('DONE');
            $('#listOfImages').empty();
            for (let b of data) {
                $('#listOfImages').append(`<strong>Titel: </strong> ${b.title} <br>`);
                $('#listOfImages').append(`<strong>Description: </strong> ${b.description} <br>`);
                $('#listOfImages').append(`<strong>Rating </strong> ${b.rating} <br> <hr>`);
            }
        }).fail(function (er1, er2) {
            console.log(er1);
            console.log(er2);
        });
    }

    $('form').submit(function(e){
        //standard behaviour block
        e.preventDefault();

        //Get all data from form with jQuery
        // $(this).serialize
        // $(this).serializeArray()

        console.log($('#titelinput').val());

        let imageObject = {
            title: $('#titelinput').val(),
            description: $('#beschrijvinginput').val(),
            rating: $('#ratinginput').val()
        };

        //Call to server
        $.ajax({
            url: 'http://127.0.0.1:3000/insertImage',
            method: 'POST',
            data: imageObject

        }).done(function(data){
            console.log('Image Inserted!');


        }).fail(function(er1, er2){
            console.log(er1);
            console.log(er2);
        });
    });



});