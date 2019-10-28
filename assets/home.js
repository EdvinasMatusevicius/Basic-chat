const registerWarning = document.querySelector('#warning');
const logInWarning = document.querySelector('#warningLog');

$(document).ready(function () {
    const formReg = $('#formReg');
    const formLog = $('#formLog');
    const logoWrap = $('#logo-wrap');
    formReg.on('submit', function (event) {
        event.preventDefault();
        const nick = $('#nicknameReg');
        const psw1 = $('#password1');
        const psw2 = $('#password2');
        let user = { nick: nick.val(), password1: psw1.val(), };
        let password2 = psw2.val();
        $.ajax({
            type: 'POST',
            url: '/reg',
            data: { userData: user, password2: password2 },
            success: function (data) {
                if (data === 'nick exists') {
                    registerWarning.innerHTML = " Nickname is already taken";
                } else if (data === 'psw mismatch') {
                    registerWarning.innerHTML = " Passwords don't match";
                } else if (data === 'success') {
                    registerWarning.innerHTML = ' Succsessfully registered';
                } else if (data === 'emptyPsw2') {
                    registerWarning.innerHTML = ' Empty fields left';
                } else if (data === 'nick length') {
                    registerWarning.innerHTML = ' Nickname has to be between 2 and 20 characters long';
                } else {
                    registerWarning.innerHTML = ' Unexpected error has occurred';
                }
            }

        })

    }),
        formLog.on('submit', function (event) {
            event.preventDefault();
            const nick = $('#nicknameLog');
            const psw = $('#password');

            let user = { nick: nick.val(), password: psw.val(), };
            $.ajax({
                type: 'POST',
                url: '/log',
                data: { userData: user },
                success: function (data) {
                    if (data === 'wrong') {
                        logInWarning.innerHTML = " Nickname or password is incorrect";
                    } else if (data === 'successLog') {
                        logInWarning.innerHTML = "Successfully loged in. If not redirected to chatroom refresh the page";
                        // location.reload();
                        window.location.pathname = '/chat';
                    } else {
                        logInWarning.innerHTML = ' Unexpected error has occurred';
                    }
                }

            })

        });
        const hideLogo = ()=>{
            if(logoWrap.is(':hidden')){
                if(formLog.is(':hidden') && formReg.is(':hidden')) {
                    logoWrap.show(200);
                }
                return
                
            } else if(!formLog.is(':hidden') || !formReg.is(':hidden')){
                if(!logoWrap.is(':hidden')){
                    logoWrap.hide();
                }
                return
            }
        };
        $('#btnReg').click(function () {
            if (formReg.is(':hidden')) {
                formLog.hide();
                formReg.slideDown(200);
                hideLogo();
            } else {
                formReg.hide();
                hideLogo();
            }
        });
        $('#btnLog').click(function () {
            if (formLog.is(':hidden')) {
                formReg.hide();
                formLog.slideDown(200);
                hideLogo();
            } else {
                formLog.hide();
                hideLogo();
            }
        })
        
});