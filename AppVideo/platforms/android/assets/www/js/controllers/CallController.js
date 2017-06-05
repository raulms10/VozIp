(function(){
    angular.module('starter')
    .controller('CallController', ['localStorageService', '$scope', '$ionicPopup', CallController]);

    function CallController(localStorageService, $scope, $ionicPopup){

            $scope.username = localStorageService.get('username');

            var peer = new Peer($scope.username, {
              //host: 'localhost', port: 3000, path: '/peerjs', //Servidor propio creado anteriormente, node server.js
              key: 'txdxwnwpcwz8h0k9',
              config: {'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
              ]}
            });

            /* if you run your own peerserver
            var peer = new Peer($scope.username, {
              host: 'your-peerjs-server.com', port: 3000, path: '/peerjs',
              config: {'iceServers': [
                { url: 'stun:stun1.l.google.com:19302' },
                { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
              ]}
            });
          */

            function getVideo(successCallback, errorCallback){
                navigator.webkitGetUserMedia({audio: true, video: true}, successCallback, errorCallback);
            }


            function onReceiveCall(call){

                $ionicPopup.alert({
                    title: 'Incoming Call',
                    template: 'Llamada entrante. Conectando..'
                });

                getVideo(
                    function(MediaStream){
                        call.answer(MediaStream);
                    },
                    function(err){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Ha ocurrido un error accendiendo a la cámara y micrófono del dispositivo'
                        });
                    }
                );

                call.on('stream', onReceiveStream);
            }


            function onReceiveStream(stream){
                var video = document.getElementById('contact-video');
                video.src = window.URL.createObjectURL(stream);
                video.onloadedmetadata = function(){
                    $ionicPopup.alert({
                        title: 'Llamada en curso',
                        template: 'Lamada iniciada. Ahora puedes hablar'
                    });
                };

            }

            $scope.startCall = function(){
                var contact_username = $scope.contact_username;

                getVideo(
                    function(MediaStream){

                        var call = peer.call(contact_username, MediaStream);
                        call.on('stream', onReceiveStream);
                    },
                    function(err){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Ha ocurrido un error accendiendo a la cámara y micrófono del dispositivo'
                        });
                    }
                );

            };

            peer.on('call', onReceiveCall);



    }

})();
