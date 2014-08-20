    var dbf = window.openDatabase("FotosLugares", "1.0", "Fotos y Lugares", 50000000);
                      // variables para el pop up con la foto
    var contenedor = '<div id="cuadro';
    var tag = '" class ="cuadrado"><img src="data:image/jpeg;base64,';
    var contenedorFin = '"/></div>';
    var imagenPrueba = 'http://www.maestrosdelweb.com/images/2011/04/SanJuan.jpg';   
    
    var datos = new Array();  

 

    function initialize() {
   
          laaa = datos[0]['latitud'];
          looo = datos[0]['longitud'];
          imm = datos[0]['imagen']
         // alert('datos arreglo : +++78 '+ laaa +' , '+ looo );
         // nueva = parseFloat(laaa);
         // alert('tipo de datos -- '+ typeof(nueva));

                   // poniendo un marcador
        

          var mapOptions = { 
          center: new google.maps.LatLng(-33.445,-70.671),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);

// inicio InfoWindow
    n=1;
    for(var i in datos){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(datos[i]['latitud'],datos[i]['longitud'])
            , map: map
            , clickable : true
        });
        popup = new google.maps.InfoWindow({
            content: contenedor + i+ tag + datos[i]['imagen'] + contenedorFin
            , zIndex: n
        });
        popup.open(map, marker);
        (function(id, popup){
            google.maps.event.addListener(popup, 'domready', function(){
                google.maps.event.addDomListener(document.getElementById('cuadro' + id), 'mousedown', function(){
                    popup.setZIndex(n++);
                });
            })
        })(n++, popup);
    }

// fin InfoWindow


// // marcador de prueba
//         var marker = new google.maps.Marker({
//         position: new google.maps.LatLng(laaa,looo)
//         , map: map
//         , title: 'Pulsa aquí'
//         , draggable: true
//     });

//          var popup = new google.maps.InfoWindow({
//         content: contenedor + imm + contenedorFin
//     });
 
//     popup.open(map, marker);
// // marcador de prueba fin         

      }  
      // funciones de la base de datos para obtener las fotos con lat y long
      function errorCB(err) {
  // Esto se puede ir a un Log de Error diría el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
    alert("Error processing SQL: Codigo: " + err.code + " Mensaje: "+ err.message);
}

      function BuscaDatos() {
  
    dbf.transaction(ObtenerDatos, errorCB);
    
      

  }

function ObtenerDatos(tx) {
    tx.executeSql('SELECT * FROM Fotos', [], MuestraDatos, errorCB);
}



function MuestraDatos(tx, results) {
     var len = results.rows.length;
     var total = "";
     var marca = document.getElementById('datos');
     
         // alert("filas leidas ultimaeee- " + len);

          for(var i = 0; i < len; i++){
           var latitud = results.rows.item(i).lat;
            var longitud = results.rows.item(i).lon;
            var imgbase64 = results.rows.item(i).base64;

            datos.push(
              {
                'latitud': latitud,
                'longitud' :  longitud,
                'imagen' : imgbase64
              });
          //total += '<p>'+latitud+'</p>'+'<h2>'+ longitud + '</h2>' + '<h3>' + imgbase64 + '</h3>';

          }

            
         //marca.innerHTML = total;
      
     // alert('Estructura de datos Creada');   
      // prueba 
      initialize();
}