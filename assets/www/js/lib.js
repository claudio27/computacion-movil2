    /**
              CAMARA
    */

    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

      // variables de la base de datos 47.68372 megabytes de almacenamiento
    var db = window.openDatabase("FotosLugares", "1.0", "Fotos y Lugares", 50000000);
    var ItemId=0;

      // variables de la foto
      var fotoBase;
      var fotoLat;
      var fotoLon;

    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        
        // base de datos
        db.transaction(CreaTablas, errorCB, successCB);
        // geolocalizacion
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
        // crea la galeria de fotos por if por si no hay datos en la bd
        Mostrar();


    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      

      fotoBase = imageData;

      // Uncomment to view the base64-encoded image data
       //alert(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;

      // agrega la foto en la base de datos
      Agregar();
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
    }


    /**

            BASE DE DATOS


    */
  


//  se llama arriba en el seteo de variables
function CreaTablas(tx) {
     tx.executeSql('CREATE TABLE IF NOT EXISTS Fotos (id integer primary key autoincrement, lat text, lon text, nombre text, base64 text)');
}

function errorCB(err) {
  
    alert("Error processing SQL: Codigo: " + err.code + " Mensaje: "+ err.message);
}

function successCB() {
  
  //alert("Todo ok base de datos");
  
}
// para crear la tabla manualmente
function CreaDB() {
  db.transaction(CreaTablas, errorCB, successCB);
}

function Agregar() {
  
    db.transaction(AgregaItem, errorCB, successCB);
  
}

function AgregaItem(tx) {
     tx.executeSql("INSERT INTO Fotos (lat, lon, nombre, base64) values ('"+fotoLat+"','"+fotoLon+"','"+nombreFoto()+"','"+fotoBase+"')");
     alert("Exito al guardar foto");
    // actualiza la galeria para las fotos despues de tomar una foto
    Mostrar();
        
}

function Mostrar() {
  
      db.transaction(ObtenerItems, errorCB);

  }

function ObtenerItems(tx) {
    tx.executeSql('SELECT * FROM Fotos', [], MuestraItems, errorCB);
}



function MuestraItems(tx, results) {
     var len = results.rows.length;
     var total = "";
     var result =document.getElementById('galeriaFotos');
  //  result.innerHTML = "<STRONG>Error processing SQL: " + err.code + "</STRONG>";

       // alert("Fotos table: " + len + " rows found.");

        for (var i=0; i<len; i++){
            //alert("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);

          /**
tag += "<li><a href='#'><img src='data:image/jpeg;base64,"+ resultado.rows.item(j).base64 
            +"'><h2>"+ resultado.rows.item(j).id+"</h2><p>"+ resultado.rows.item(j).lat+"</p></a></li>";

total += "<p>Row = " + i + " ID = " + results.rows.item(i).id + " Lat =  " + results.rows.item(i).lat + "</p><br>"+
        "<p>Lon = "+ results.rows.item(i).lon +"</p> <br>"+"<img style='display:block;width:60px;height:60px;' src='data:image/jpeg;base64,"+results.rows.item(i).base64+"'> <br>" ;

          **/

total += "<li><a href='#' class='cars' id="+results.rows.item(i).id+"><img src='data:image/jpeg;base64,"+ results.rows.item(i).base64 
            +"'><h2>"+ results.rows.item(i).id+"</h2><p>"+ results.rows.item(i).nombre+"</p></a></li>";

        
        }

        result.innerHTML = total;
}

/**

        GEOLOCALIZACION

*/



    function buscaPosicion(){

        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
    // device APIs are available
    //
   /** function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }**/

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var element = document.getElementById('geolocation');

        fotoLat = position.coords.latitude;
        fotoLon = position.coords.longitude;

        element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Timestamp: '          + position.timestamp                    + '<br />';
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

/**
            pop-up jquery
*/

$( document ).on( "pageinit", "#galeria", function() {
    $( ".cars" ).on( "click", function() {
        var target = $( this ),
            brand = target.find( "h2" ).html(),
            model = target.find( "p" ).html(),
            short = target.attr( "id" ),
            imagen = target.find("img").attr("src"), // la magia jajajaja :D
            closebtn = '<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" data-shadow="false" data-iconshadow="false" class="ui-btn-right">Close</a>',
            header = '<div data-role="header"><h2>' + brand + ' ' + model + '</h2></div>',
            img = '<img src="' + imagen + '" alt="' + brand + '" class="photo">',
            popup = '<div data-role="popup" id="popup-' + short + '" data-short="' + short +'" data-theme="none" data-overlay-theme="a" data-corners="false" data-tolerance="15">' + closebtn + header + img + '</div>';
        // alert(imagen);

        // Create the popup. Trigger "pagecreate" instead of "create" because currently the framework doesn't bind the enhancement of toolbars to the "create" event (js/widgets/page.sections.js).
        $.mobile.activePage.append( popup ).trigger( "pagecreate" );
        // Wait with opening the popup until the popup image has been loaded in the DOM.
        // This ensures the popup gets the correct size and position
        $( ".photo", "#popup-" + short ).load(function() {
            var height = $( this ).height(),
                width = $( this ).width();
            // Set height and width attribute of the image
            $( this ).attr({ "height": height, "width": width });
            // Open the popup
            $( "#popup-" + short ).popup( "open" );
            // Clear the fallback
            clearTimeout( fallback );
        });
        // Fallback in case the browser doesn't fire a load event
        var fallback = setTimeout(function() {
            $( "#popup-" + short ).popup( "open" );
        }, 2000);
    });
    // Set a max-height to make large images shrink to fit the screen.
    $( document ).on( "popupbeforeposition", ".ui-popup", function() {
        // 68px: 2 * 15px for top/bottom tolerance, 38px for the header.
        var maxHeight = $( window ).height() - 68 + "px";
        $( "img.photo", this ).css( "max-height", maxHeight );
    });
    // Remove the popup after it has been closed to manage DOM size
    $( document ).on( "popupafterclose", ".ui-popup", function() {
        $( this ).remove();
    });
});

//     // nombre para la foto

    function nombreFoto()
{
  var fecha
  fecha=new Date();
  var cadena=fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getYear()+'-'+fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
  return cadena;
}