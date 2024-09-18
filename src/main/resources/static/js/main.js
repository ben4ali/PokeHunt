'use strict';
const userForm = document.querySelector(".userForm")

let stompClient = null
let user = null
function connect(event){
    event.preventDefault();
    user = userForm.querySelector( "input").value
    console.log(user)
    if (user) {
        console.log("CONNECTED")

        let socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError)
    }
}

function onConnected(){
    //subscribe to public topic
    stompClient.subscribe('/topic/public',onPositionReceived);

    //tell username to server
    stompClient.send('/app/player.addUser',
        {},
        JSON.stringify({username:user, type:'JOIN'})
    );
    gsap.to(userForm,{
        opacity: 0,
        duration:1.5,
        onComplete:()=>{
            userForm.style.display = "none"
            map.parentElement.style.display = "block"
            gsap.to(map.parentElement,{
                opacity:1,
                duration:1.5,
                onComplete:()=>{
                    encounter = false
                }
            })
        }
    })
}

function onPositionReceived(payload){
    let content = JSON.parse(payload.body);
    if (content.type === 'JOIN'){
        console.log(content.username + " has joined.")
    }else if (content.type === 'LEAVE'){
        console.log(content.username + " has left.")
    }else{
        console.log("PLAYER: "+content.username+" POSITION: "+content.x+" | "+content.y)
    }
}

function onError(){
    console.log("Error connecting to websocket server")
}

userForm.addEventListener("submit",connect,true)
// userForm.addEventListener("submit",sendMessage,true)
document.addEventListener("keydown",sendPosition,true)
function sendPosition(event) {
    let posX = 0
    let posY = 0


    //MOVE LOGIC
    if (encounter || map.parentElement.style.display === "none"){
        return
    }
    console.log(encounter)
    if (event.key==="w"){
        if (map.firstElementChild.style.transform.split(",")[1] != undefined){
            if (parseInt(map.firstElementChild.style.transform.split(",")[1].split("px")[0])+SPEED>=800){
                SPEED = 0
            }else{
                SPEED = 25
            }
        }
        gsap.set(map.firstElementChild,{
            y: "+="+SPEED,
        })
        if (walking==false){
            player.src = "../assets/images/frontWalk.gif"
        }
    }
    if (event.key==="s"){

        if (map.firstElementChild.style.transform.split(",")[1] != undefined){
            if (parseInt(map.firstElementChild.style.transform.split(",")[1].split("px")[0])+SPEED<=-1180){
                SPEED = 0
            }else{
                SPEED = 25
            }
        }

        gsap.set(map.firstElementChild,{
            y: "-="+SPEED,
        })
        if (walking==false){
            player.src = "../assets/images/backWalk.gif"
        }

    }
    if (event.key==="a"){

        if (map.firstElementChild.style.transform.split(",")[0] != undefined){
            if (parseInt(map.firstElementChild.style.transform.split(",")[0].split("px")[0].split("(")[1])+SPEED>=1215){
                SPEED = 0
            }else{
                SPEED = 25
            }
        }

        gsap.set(map.firstElementChild,{
            x: "+="+SPEED,
        })
        if (walking==false){
            player.src = "../assets/images/leftWalk.gif"
        }

    }
    if (event.key==="d"){

        if (map.firstElementChild.style.transform.split(",")[0] != undefined){
            if (parseInt(map.firstElementChild.style.transform.split(",")[0].split("px")[0].split("(")[1])+SPEED<=-1950){
                SPEED = 0
            }else{
                SPEED = 25
            }
        }

        gsap.set(map.firstElementChild,{
            x: "-="+SPEED,
        })
        if (walking==false){
            player.src = "../assets/images/rightWalk.gif"
        }
    }
    walking = true

    let randomPlayer = getRandomInt(ENCOUNTER_ODDS)
    if (randomPlayer==1){
        console.log("Encounter")
        transition()
    }


    //SOCKET
    if ((posX && posY) && stompClient ){
        let playerPosition = {
            username: user,
            x: posX,
            y: posY,
            type: 'MOVING'
        };
        stompClient.send(
            '/app/player.sendPosition',
            {},
            JSON.stringify(playerPosition)
        );
        posX = ""
        posY = ""
    }
}
