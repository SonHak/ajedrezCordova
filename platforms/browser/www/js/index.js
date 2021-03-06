/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var figuras = ["","♔","♚"];
var myId = null;
var idPartida = null;
var posOrigen = "";
var posFinal = "";
var figura = "";


 var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        document.getElementById('login').addEventListener("click",formLogin);
        document.getElementById('logout').addEventListener("click",logout);

        let i = setInterval(function(){
            getPartida(i);
        },5000);

        setInterval(function(){
            setFicha(idPartida);
        },5000);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    crearTablero: function(){


        //var abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var tablero = $('#tabla');

        for(var i=0;i<=8;i++){
            for(var j=0;j<=8;j++){

                if(i == 0){
                    tablero.append("<th>"+j+"</th>");
                }
                else if(j == 0){
                    tablero.append("<tr></tr> ");
                    tablero.append("<th>"+i+"</th>");
                }
                
                
                else{
                    if(j > 8){
                        tablero.append("<tr></tr>");
                    }else{
                        if((i % 2 == 0 && j % 2 == 0)||(i % 2 != 0 && j % 2 != 0)){

                            var cuadrado = $("<td id="+i+j+" class='black' style='background-color: black' ></td>");
                            cuadrado.click(function printPosicion(event){
                                actualizarFicha(event.currentTarget.id);

                            });
                            if(i == 8 && j == 3){
                                //utilizar unicode ficha
                            }
                            tablero.append(cuadrado);
                            

                        }else{

                         var cuadrado = $("<td id="+i+j+" class='white' style='background-color: white' ></td>");
                         cuadrado.click(function printPosicion(event){
                            actualizarFicha(event.currentTarget.id);
                        });
                         tablero.append(cuadrado);
                     }
                 }
             }
         }
     }

     },

    mostrarUsuarios: function(){
        setInterval(listadoUsuarios,5000);
     },

};


function formLogin(){

    var mail = $('#email').val();
    var passwd = $('#password').val();

    $.ajax({
        type: "POST",
        url:"https://adriescacs.herokuapp.com/api/login",
        data: {email: mail, password: passwd},
        //contentType: "application/json; charset=utf-8",
        timeout: 2000,
        success: function(data) {

            if(data != "error al loggear"){
                alert("Logeado con exito");
                $('#myusuario').append($('<input>',{'id' : 'emailUser'}).text(data.email));
                $('#myusuario').append($('<input>',{'id' : 'myId'}).text(data.id));
                $('#myusuario').append($('<input>',{'id' : 'token'}).text(data.token));
                myId = data.id;
                app.mostrarUsuarios();

                $('#formulario').hide(1000);
                $('#mostrar').show(100);                
                $('#logout').show(1000);

            }else{
                alert(data);
            }

        } ,
        error: function(data) { alert("fail"); }
    });
    
}

function logout(){

    var email = $('#emailUser').val();
    var token = $('#token').val();


    $.ajax({
        type: "POST",
        url: "https://adriescacs.herokuapp.com/api/logout",
        data: {email: email, token: token},
        timeout: 5000,
        success: function(data){
            alert("Hasta la próxima");
            $('#myusuario').empty();
            $('#tabla').empty();

            $('#formulario').show(1000);
            $('#mostrar').hide(100);
            $('#logout').hide(1000);

            i = setInterval(function(){
                 getPartida(i);
            },5000);   

             myId = null;
             idPartida = null;
             posOrigen = "";
             posFinal = "";
             figura = "";


        },
        error: function(data) {alert("fail al hacer logout"); }
    });

}


function invitarJugador(){
    var idInvitado = $(this).parent()[0].id;

    $.ajax({
        type: "POST",
        url: "https://adriescacs.herokuapp.com/api/juga",
        data: {usuarioCrea: myId, usuarioAcepta: idInvitado},
        timeout: 5000,
        success: function(data){
            console.log(data); 
            idPartida = data.id;
            getPartida(idPartida);          
        } ,
        error: function(data) { alert("error al devolver contenido"); }

    });

}


function getPartida(i){

    console.log(myId);
    if(myId != null && myId != "" && myId != "undefined"){
        $.ajax({
            type: "POST",
            url: "https://adriescacs.herokuapp.com/api/getPartida",
            data: {id : myId},
            timeout: 5000,
            success: function(data){
                console.log(data);
                if(idPartida != "" && idPartida != null && idPartida != "undefined" || data.user1 == myId || data.user2 == myId){
                    $('#mostrar').hide();
                    app.crearTablero();
                    setFichasInicio(data.id);
                }
                idPartida = data.id;

                clearInterval(i);

            },
            error: function(data){ console.log(data)},
        });
    }
}

function setFichasInicio(id){
    
    $.ajax({
        type: "POST",
        url: "https://adriescacs.herokuapp.com/api/setFichas",
        data: {currentId: id},
        timeout: 5000,
        success: function(data){
            data = JSON.parse(data);
            console.log(data)

            if(data.state == "1"){
                setFicha(id);
            }

        },
        error: function(data){console.log(data)},
    });

}



function setFicha(id){
      $.ajax({
        type: "POST",
        url: "https://adriescacs.herokuapp.com/api/getFichas",
        data: {id: id},
        timeout: 5000,
        success: function(data){
            console.log(data)
            $("table span").remove();
            for(var i = 0 ; i<data.length; i++){
                    var figurita = $("<span>",{'id': data[i].id}).text(figuras[data[i].figura]);
                    $('#'+data[i].posFinal).append(figurita);
                
            }

        },
        error: function(data){console.log(data)},
    });
}


function actualizarFicha(event){

    var hijo = $('#'+event).children();

    if(posOrigen == "" && posFinal == "" && hijo.length > 0){
        posOrigen = event;
        figura = hijo[0].id;
    }else if(posOrigen != "" && posFinal == ""){
        posFinal = event;
         $.ajax({
                type: "POST",
                url: "https://adriescacs.herokuapp.com/api/actualizar",
                data: {posOrigen: posOrigen,posFinal: posFinal,idPartida: idPartida, idFigura: figura},
                timeout: 5000,
                success: function(data){
                    console.log("actualiza");
                    posOrigen = "";
                    posFinal = "";
                },
                error: function(data) {alert("fail al enviar datos"); }
            });
    }

   
}




function listadoUsuarios(){

            $.ajax({
                type: "POST",
                url: "https://adriescacs.herokuapp.com/api/espera",
                dataType: "JSON",
                timeout: 5000,
                success: function(data){
                    $('#mostrar').empty();
                    $('#mostrar').append($('<ol>USUARIOS QUE NO ESTÁN EN PARTIDA</ol>'));

                    for(var i=0; i<data.length;i++){

                        if(data[i].token != $('#token').text())
                        {   
                            var btn = $("<button>").text("Invitar").on("click",invitarJugador);
                            $('#mostrar')
                            .append($('<li>',{
                                'id' : data[i].id,                                                  
                                'value': data[i].token,
                                    }).append($('<span>').text(data[i].email))
                                      .append(btn)
                                  );
                        }else{
                            console.log("son iguales");
                        }
                    }  
                },
                error: function(data) {alert("error al devolver contenido"); }
            })
}


//adriescacs.herokuapp.com/api/login

app.initialize();
