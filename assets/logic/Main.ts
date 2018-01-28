class MainClass {

    public init(socket, token) {

        socket.emit('init', token)

    }


    public timeAgo(timeagoInstance, lang) {

        timeagoInstance.render($('#profileTimeAgo'), lang);

    }




    public requestFriendButton(lang, feather) {

        function setRequestFriendSent(lang, $this) {
            if(lang == 'fr') {
                $this.text('Demande d\'ami envoyée');
                $this.addClass('button-option-activated')
            } else if(lang == 'en') {
                $this.text('Friend request sent');
                $this.addClass('button-option-activated')
            }
        }

        function setRequestFriendDefault(lang, $this) {
            const userAddIcon = '<i data-feather="user-plus" class="user-add-icon" width="13" height="13"></i>'
            if(lang == 'fr') {
                $this.html(userAddIcon + ' Demander en ami');
                $this.removeClass('button-option-activated')
                feather.replace()
            } else if(lang == 'en') {
                $this.html(userAddIcon + 'Ask friend');
                $this.removeClass('button-option-activated')
                feather.replace()
            }
        }

        const requestFriendButton = $('[data-func="request-friend"]')
        let requestFriendState = requestFriendButton.data('request-state')
        requestFriendButton.click(function() {
            const $this = $(this);
            if(requestFriendState == 'no') {

                $this.attr('data-request-state', 'pending');
                requestFriendState = 'pending';
                setRequestFriendSent(lang, $this);

            } else if (requestFriendState == 'pending') {

                $this.attr('data-request-state', 'no');
                requestFriendState = 'no';
                setRequestFriendDefault(lang, $this);

            }

        })

    }




    public welcomeAnimation() {

        $('#chooseLogin').click(function() {
            $('#chooseSignup').removeClass('selected')
            $(this).addClass('selected')
            $('#signup').hide()
            $('#login').show()
        })

        $('#chooseSignup').click(function() {
            $('#chooseLogin').removeClass('selected')
            $(this).addClass('selected')
            $('#login').hide()
            $('#signup').show()
        })

    }




    public requestFriend(socket, token, lang) {

        const requestFriendButton = $('[data-func="request-friend"]')
        let requestFriendState = requestFriendButton.data('request-state')

        requestFriendButton.click(function() {
            const $this = $(this);
            const data = $this.data('gd')

            // Si aucune demande n'a été envoyée
            if(requestFriendState == 'no') {
                requestFriendState = 'pending';

                socket.emit('friend-request', { gd: data, user_token: token})

            // Si une demande est en cours
            } else if (requestFriendState == 'pending') {
                requestFriendState = 'no';

                socket.emit('cancel-friend-request', data)

            }

        })

    }



    public displayFriendRequests(socket, token, timeagoInstance, lang) {

        const langTemplate = (sentence, lang) => {
            if(sentence == 'no.friend.request')
                return lang == 'fr' ? 'Aucune demande d\'ami' : 'No friend request'
            if(sentence == 'loading')
                return lang == 'fr' ? 'Chargement...' : 'Loading...'
            if(sentence == 'request.made')
                return lang == 'fr' ? 'Demande faite' : 'Request sent'
        }

        const loading  = () => {

            return ('<div class="topbar-box-loading">'+ langTemplate('loading', lang) +'</div>')

        }

        // Clic
        const friendRequestsIcon = $('#friendRequestsIcon')
        let loadingState = friendRequestsIcon.data('loading-state')
        // Lors du clic
        friendRequestsIcon.click(() => {

            // Si les demandes n'ont pas été chargées
            if(loadingState == 'no') {

                // On affiche le loader
                $('#friendRequestsDisplay').html(loading())
                // On affiche la box
                $('#friendRequestsBox').fadeIn(200)
                // On change le state
                friendRequestsIcon.attr('data-loading-state', 'loaded')
                loadingState = 'loaded'

                setTimeout(() => {
                    // On demande a obtenir les demandes
                    socket.emit('catch-friend-requests', token)

                }, 500)

            } else if (loadingState == 'loaded') {

                // Si les demandes sont chargées
                $('#friendRequestsBox').fadeToggle(200)

            }

        })

        const template = (data) => {

            return (
                '<div class="chips">\
                    <div class="chips-in">\
                        <div class="chips-image" style="'+ data.emitter.avatar +'"></div>\
                        <a href="/user/'+ data.emitter.username +'" class="chips-title" title="Voir le profil de '+ data.emitter.username +'">'+ data.emitter.username +'</a>\
                        <span class="chips-text">'+ langTemplate('request.made', lang) +' <span class="timeAgo" datetime="'+ data.friendRequest.request_date +'">...</span></span>\
                        <div class="chips-choice">\
                            <button class="button button-chips button-chips-colored" data-gd=\'{ "token" : "'+ data.emitter.token +'" }\'>Accepter</button>\
                            <button class="button button-chips button-chips-default">Refuser</button>\
                        </div>\
                    </div>\
                </div>'
            )



        }

        const template2 = () => {

            return (
                '<div class="topbar-box-message">'+ langTemplate('no.friend.request', lang) +'</div>'
            )

        }

        socket.on('before-display-friend-requests', (data) => {

            $('#friendRequestsDisplay').html('')

            socket.emit('get-friend-requests', data)

        })

        // Si il y a des demandes d'ami
        socket.on('display-friend-request', (data) => {

            $('#friendRequestsDisplay').append(template(data))

            timeagoInstance.render($('.timeAgo'), lang);

        })

        // Si il n'y a pas de demandes d'ami
        socket.on('no-friend-request', () => {

            $('#friendRequestsDisplay').html('')

            $('#friendRequestsDisplay').html(template2())

        })

    }


}

const Main = new MainClass;
