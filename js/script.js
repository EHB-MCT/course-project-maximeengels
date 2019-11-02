$(function(){
    console.log('linked');
    //default setup
    $('form').hide();
    $('#listOfBooks').show();
    getList();


    //Eventlisteners voor buttons
    $('#list').click(function(){
        $('form').hide();
        $('#listOfBooks').show();
        getList();
    });
    $('#form').click(function(){
        $('form').show();
        $('#listOfBooks').hide();
    });


    function getList(){

        $.ajax({
            url: 'http://localhost:3000/getBooks',
            method: 'GET',
            dataType: 'json'
        }).done(function(data){
            console.log('DONE');
            for(let b of data){
                $('#listOfBooks').append(`<strong>Titel: </strong> ${b.titel} <br>`);
            }
        }).fail(function(er1, er2){
            console.log(er1);
            console.log(er2);
        });



    }



});
