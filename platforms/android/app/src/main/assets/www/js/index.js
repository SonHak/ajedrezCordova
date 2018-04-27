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
        this.receivedEvent('deviceready');
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
        var abc = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
        var tablero = $('#tabla');

        for(var i=0;i<=8;i++){
            for(var j=0;j<=8;j++){
                
                if(i == 0){
                    tablero.append("<th>"+j+"</th>");
                }
                else if(j == 0){
                    tablero.append("<tr></tr> ");
                    tablero.append("<th>"+abc[i-1]+"</th>");
                }
                
                
                else{
                    if(j > 8){
                        tablero.append("<tr></tr>");
                    }else{
                            if((i % 2 == 0 && j % 2 == 0)||(i % 2 != 0 && j % 2 != 0)){
                                    var cuadrado = $("<td id="+abc[i-1]+j+" style='background-color: black' ></td>");
                                    cuadrado.click(function printPosicion(event){
                                                    alert(event.currentTarget.id);
                                                   });
                                    tablero.append(cuadrado);
                            
                                
                             }else{
                            
                               var cuadrado = $("<td id="+abc[i-1]+j+" style='background-color: white' ></td>");
                               cuadrado.click(function printPosicion(event){
                                                alert(event.currentTarget.id);
                                               });
                                tablero.append(cuadrado);
                            }
                        }
                    }
            }
        }

    }
};



app.initialize();
app.crearTablero();