var MainClass = /** @class */ (function () {
    function MainClass() {
    }
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
    MainClass.prototype.requestFriend = function (socket, user_token) {
        var requestFriendButton = $('[data-func="request-friend"]');
        var requestFriendState = requestFriendButton.data('request-state');
        requestFriendButton.click(function () {
            var $this = $(this);
            var data = $this.data('gd');
            // Si aucune demande n'a été envoyée
            if (requestFriendState == 'no') {
                requestFriendState = 'pending';
                socket.emit('friend-request', { gd: data, user_token: user_token });
                // Si une demande est en cours
            }
            else if (requestFriendState == 'pending') {
                requestFriendState = 'no';
                socket.emit('cancel-friend-request', data);
            }
        });
    };
    return MainClass;
}());
var Main = new MainClass;
var io;
var url = 'http://127.0.0.1:4003';
var socket = io.connect(url);
