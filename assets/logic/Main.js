var MainClass = /** @class */ (function () {
    function MainClass() {
    }
    MainClass.prototype.init = function (socket, token) {
        socket.emit('init', token);
    };
    MainClass.prototype.timeAgo = function (timeagoInstance, lang) {
        timeagoInstance.render($('#profileTimeAgo'), lang);
    };
    MainClass.prototype.requestFriendButton = function (lang, feather) {
        function setRequestFriendSent(lang, $this) {
            if (lang == 'fr') {
                $this.text('Demande d\'ami envoyée');
                $this.addClass('button-option-activated');
            }
            else if (lang == 'en') {
                $this.text('Friend request sent');
                $this.addClass('button-option-activated');
            }
        }
        function setRequestFriendDefault(lang, $this) {
            var userAddIcon = '<i data-feather="user-plus" class="user-add-icon" width="13" height="13"></i>';
            if (lang == 'fr') {
                $this.html(userAddIcon + ' Demander en ami');
                $this.removeClass('button-option-activated');
                feather.replace();
            }
            else if (lang == 'en') {
                $this.html(userAddIcon + 'Ask friend');
                $this.removeClass('button-option-activated');
                feather.replace();
            }
        }
        var requestFriendButton = $('[data-func="request-friend"]');
        var requestFriendState = requestFriendButton.data('request-state');
        requestFriendButton.click(function () {
            var $this = $(this);
            if (requestFriendState == 'no') {
                $this.attr('data-request-state', 'pending');
                requestFriendState = 'pending';
                setRequestFriendSent(lang, $this);
            }
            else if (requestFriendState == 'pending') {
                $this.attr('data-request-state', 'no');
                requestFriendState = 'no';
                setRequestFriendDefault(lang, $this);
            }
        });
    };
    MainClass.prototype.welcomeAnimation = function () {
        $('#chooseLogin').click(function () {
            $('#chooseSignup').removeClass('selected');
            $(this).addClass('selected');
            $('#signup').hide();
            $('#login').show();
        });
        $('#chooseSignup').click(function () {
            $('#chooseLogin').removeClass('selected');
            $(this).addClass('selected');
            $('#login').hide();
            $('#signup').show();
        });
    };
    MainClass.prototype.requestFriend = function (socket, token, lang) {
        var requestFriendButton = $('[data-func="request-friend"]');
        var requestFriendState = requestFriendButton.data('request-state');
        requestFriendButton.click(function () {
            var $this = $(this);
            var data = $this.data('gd');
            // Si aucune demande n'a été envoyée
            if (requestFriendState == 'no') {
                requestFriendState = 'pending';
                socket.emit('friend-request', { gd: data, user_token: token });
                // Si une demande est en cours
            }
            else if (requestFriendState == 'pending') {
                requestFriendState = 'no';
                socket.emit('cancel-friend-request', data);
            }
        });
    };
    MainClass.prototype.displayFriendRequests = function (socket, token, timeagoInstance, lang) {
        var langTemplate = function (sentence, lang) {
            if (sentence == 'no.friend.request')
                return lang == 'fr' ? 'Aucune demande d\'ami' : 'No friend request';
            if (sentence == 'loading')
                return lang == 'fr' ? 'Chargement...' : 'Loading...';
            if (sentence == 'request.made')
                return lang == 'fr' ? 'Demande faite' : 'Request sent';
        };
        var loading = function () {
            return ('<div class="topbar-box-loading">' + langTemplate('loading', lang) + '</div>');
        };
        // Clic
        var friendRequestsIcon = $('#friendRequestsIcon');
        var loadingState = friendRequestsIcon.data('loading-state');
        // Lors du clic
        friendRequestsIcon.click(function () {
            // Si les demandes n'ont pas été chargées
            if (loadingState == 'no') {
                // On affiche le loader
                $('#friendRequestsDisplay').html(loading());
                // On affiche la box
                $('#friendRequestsBox').fadeIn(200);
                // On change le state
                friendRequestsIcon.attr('data-loading-state', 'loaded');
                loadingState = 'loaded';
                setTimeout(function () {
                    // On demande a obtenir les demandes
                    socket.emit('catch-friend-requests', token);
                }, 500);
            }
            else if (loadingState == 'loaded') {
                // Si les demandes sont chargées
                $('#friendRequestsBox').fadeToggle(200);
            }
        });
        var template = function (data) {
            return ('<div class="chips">\
                    <div class="chips-in">\
                        <div class="chips-image" style="' + data.emitter.avatar + '"></div>\
                        <a href="/user/' + data.emitter.username + '" class="chips-title" title="Voir le profil de ' + data.emitter.username + '">' + data.emitter.username + '</a>\
                        <span class="chips-text">' + langTemplate('request.made', lang) + ' <span class="timeAgo" datetime="' + data.friendRequest.request_date + '">...</span></span>\
                        <div class="chips-choice">\
                            <button class="button button-chips button-chips-colored" data-gd=\'{ "token" : "' + data.emitter.token + '" }\'>Accepter</button>\
                            <button class="button button-chips button-chips-default">Refuser</button>\
                        </div>\
                    </div>\
                </div>');
        };
        var template2 = function () {
            return ('<div class="topbar-box-message">' + langTemplate('no.friend.request', lang) + '</div>');
        };
        socket.on('before-display-friend-requests', function (data) {
            $('#friendRequestsDisplay').html('');
            socket.emit('get-friend-requests', data);
        });
        // Si il y a des demandes d'ami
        socket.on('display-friend-request', function (data) {
            $('#friendRequestsDisplay').append(template(data));
            timeagoInstance.render($('.timeAgo'), lang);
        });
        // Si il n'y a pas de demandes d'ami
        socket.on('no-friend-request', function () {
            $('#friendRequestsDisplay').html('');
            $('#friendRequestsDisplay').html(template2());
        });
    };
    return MainClass;
}());
var Main = new MainClass;
