//make conection to socket io
const socket = io.connect('http://localhost:3000');
// var socket = io({transports: ['websocket'], upgrade: false});  //jei useris perkraudinetu puslapi su f5 ir del to susidarytu problema
// https://stackoverflow.com/questions/41924713/node-js-socket-io-page-refresh-multiple-connections

document.addEventListener("DOMContentLoaded", function () {
    //DOM querys
    const onlineUsers = document.querySelector('#online-window-users');
    const message = document.querySelector('#message-input-field');
    const messageWindow = document.querySelector('#message-window');
    const output = document.querySelector('#output');
    const feedback = document.querySelector('#feedback');
    //buttons
    const btnSend = document.querySelector('#btn-send');
    const btnThemes = document.querySelector('#btn-themes');
    const btnThemesBright = document.querySelector('#btn-themes-bright');
    const btnThemesBlue = document.querySelector('#btn-themes-blue');
    const btnThemesDark = document.querySelector('#btn-themes-dark');
    const themeBrush = document.querySelector('#brush-img');

    //Scrollbar
    const simpleBar = document.querySelector('#message-window .simplebar-content-wrapper');

    function sendMessage() {
        if (message.value.length > 0) {
            socket.emit('chat', {
                message: message.value,
            });
            messageWindow.scrollTo(0, 10);
            message.value = null;
        }
    }
    //KEYBOARD EVENTS
    function pressEnter(e) {
        if (e.code === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    }
    //SPALVU TEMOS
    function showThemeBtn() {
        themeBrush.classList.toggle('hide');
        btnThemesBright.classList.toggle('btn-themes-bright');
        btnThemesBlue.classList.toggle('btn-themes-blue');
        btnThemesDark.classList.toggle('btn-themes-dark');
    }                                                               //JEI BUS DAUGIAU MYGTUKU SUKURTI JIEM ATSKIRA FUNKCIJA
    function hideThemeBtn() {
        themeBrush.classList.toggle('hide');
        btnThemesBright.classList.toggle('btn-themes-bright');
        btnThemesBlue.classList.toggle('btn-themes-blue');
        btnThemesDark.classList.toggle('btn-themes-dark');
    }
    function changeCssVar(variable, value) {
        document.documentElement.style.setProperty(variable, value);
    };
    function setTheme(bodyDark, bodyLight, textBG, textColor, btnLogOff, btnLogOffHover, btnThemes,
        btnSend, btnSendHover, btnText) {
        changeCssVar('--body-dark', bodyDark);
        changeCssVar('--body-lighter', bodyLight);
        changeCssVar('--text-background', textBG);
        changeCssVar('--text-color', textColor);
        changeCssVar('--btn-log-off', btnLogOff);
        changeCssVar('--btn-log-off-hover', btnLogOffHover);
        changeCssVar('--btn-themes', btnThemes);
        changeCssVar('--btn-send', btnSend);
        changeCssVar('--btn-send-hover', btnSendHover);
        changeCssVar('--btn-text-color', btnText);
    }
    //SCROLLBAR FUNCTIONS
    let scrollMoved = false;

    const checkIfScrollMoved = () => {
        const msgWinContent = output.scrollHeight + feedback.scrollHeight;
        const scrollPosition = simpleBar.scrollTop + messageWindow.offsetHeight;
        simpleBar.addEventListener('scroll', function () {
            scrollMoved = true;
        })
        if (scrollMoved) {
            if (msgWinContent-3 <=scrollPosition && msgWinContent+3>= scrollPosition) {
                scrollMoved = false;
            }
        }
    }
    const moveScrollBottom = () => {
        if (scrollMoved) {
            return
        } else {
            simpleBar.scrollTop = output.scrollHeight;
        }
    }
    //AKTYVUS KLAUSYTOJAI
    if (window.location.pathname === '/chat') {
        document.addEventListener('keydown', pressEnter);
        btnSend.addEventListener('click', function () {
            sendMessage();
        });
        message.addEventListener('keypress', function () {
            socket.emit('typing', {});
        })

        socket.on('chat', function (data) {

            checkIfScrollMoved();
            console.log(output.scrollHeight + feedback.scrollHeight, simpleBar.scrollTop + messageWindow.offsetHeight)
            feedback.innerHTML = '';
            output.innerHTML += '<div class="chat-message-wrap"><p class="chat-message"><b>' + data.nick + '</b>: ' + data.message + '</p></div><br>';
            moveScrollBottom();
            // simpleBar.scrollTop = output.scrollHeight;
            // console.log(messageWindow.offsetHeight)
        });

        socket.on('typing', function (data) {
            checkIfScrollMoved();
            feedback.innerHTML = '<span><em>' + data.nick + ' is typing a message...</em></span>';
            moveScrollBottom();
        });
        socket.on('updateOnline', function (data) {
            onlineUsers.innerHTML = '';
            data.forEach((user) => {
                onlineUsers.innerHTML += '<span class="online-user"><div class="green-dot"></div>' + user.nick + '</span>';
            })
        });
        btnThemes.addEventListener('mouseover', function () {
            showThemeBtn();
        })
        btnThemes.addEventListener('mouseout', function () {
            hideThemeBtn();
        })
        btnThemesBright.addEventListener('click', function () {
            themeBrush.src= "/img/brushB.png";
            setTheme('#d1d1d1', '#ffffff', '#ffffff', '#535353', '#494949', '#000000', '#e7e7e7', '#494949', '#000000', '#ffffff')
        });
        btnThemesBlue.addEventListener('click', function () {
            themeBrush.src= "/img/brushBL.png";
            setTheme('#1d2e69', '#0f6ab4', 'white', '#2e2e2e', '#ff4a32', '#e90202', '#759ee9', '#02ad02', 'green', 'white')
        });
        btnThemesDark.addEventListener('click', function () {
            themeBrush.src= "/img/brushW.png";
            setTheme('#000000', '#2e2e2e', '#000000', '#f6f6f6', '#ffffff', '#ffffff', '#525252', '#ffffff', '#ffffff', '#444444')
        });
    };
})
