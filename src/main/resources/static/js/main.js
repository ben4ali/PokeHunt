'use strict';
const userForm = document.querySelector(".userForm")

let stompClient = null
let user = null

let offsetX = 0
let offsetY = 0
function connect(event){
    event.preventDefault();
    user = userForm.querySelector( "input").value
    if (user) {
        player.setAttribute("data-name",user)
        player.firstElementChild.textContent = user
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
        JSON.stringify({username:user, type:'JOIN',sprite:"../assets/images/"+character_name+"FrontIdle.png"})
    );

    gsap.to(".userCreation",{
        opacity: 0,
        duration:1.5,
        onComplete:()=>{
            document.querySelector(".userCreation").style.display="none"
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
        console.log("**************************"+content.sprite+"*****************************")
        checkIfPlayerExists(content.username,content.sprite)
    }else if (content.type === 'LEAVE'){
        console.log(content.username + " has left.")
        if (content.username !== user){
            removePlayerFromGame(content.username)
        }
    }else{
        console.log("PLAYER: "+content.username+" POSITION: "+content.x+" | "+content.y)
        if (content.username !== user){
            updatePlayerPosition(content.username,content.x,content.y,content.sprite)
        }
    }
}

function onError(){
    console.log("Error connecting to websocket server")
}

userForm.addEventListener("submit",connect,true)
document.addEventListener("keydown",sendPosition,true)
function sendPosition(event) {

    //MOVE LOGIC
    if (encounter || map.parentElement.style.display === "none"){
        return
    }
    let moveDirection = "none"
    if (event.key==="w"){
        moveDirection = "front"
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
        offsetY+=SPEED
        if (walking==false){
            player.lastElementChild.src = "../assets/images/"+character_name+"FrontWalk.gif"
        }
    }
    if (event.key==="s"){
        moveDirection = "back"
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
        offsetY-=SPEED
        if (walking==false){
            player.lastElementChild.src = "../assets/images/"+character_name+"BackWalk.gif"
        }

    }
    if (event.key==="a"){
        moveDirection = "left"
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
        offsetX+=SPEED
        if (walking==false){
            player.lastElementChild.src = "../assets/images/"+character_name+"LeftWalk.gif"
        }

    }
    if (event.key==="d"){
        moveDirection = "right"
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
        offsetX-=SPEED
        if (walking==false){
            player.lastElementChild.src = "../assets/images/"+character_name+"RightWalk.gif"
        }
    }
    walking = true
    moveOtherPlayers(moveDirection)
    let randomPlayer = getRandomInt(ENCOUNTER_ODDS)
    if (randomPlayer==1){
        console.log("Encounter")
        transition()
    }

    //SOCKET
    sendPayload()
}
function sendPayload(){
    let posX = parseInt(map.firstElementChild.style.transform.split(",")[0].split("px")[0].split("(")[1])
    let posY = parseInt(map.firstElementChild.style.transform.split(",")[1])
    if ( stompClient ){

        let playerPosition = {
            username: user,
            x: posX,
            y: posY,
            sprite: player.lastElementChild.src,
            type: 'MOVING'
        };
        stompClient.send(
            '/app/player.sendPosition',
            {},
            JSON.stringify(playerPosition)
        );
        posX = ""
        posY = ""
    }else{
        console.log("Couldnt send position")
    }
}
let players = []
function checkIfPlayerExists(name,sprite){
    if (players.includes(name)){
        return
    }else{
        addPlayerToGame(name,sprite)
    }
}
function addPlayerToGame(name,sprite){
    players.push(name)
    if (name === user) return
    console.log("-------------"+sprite+"----------------")
    let playerDivElement = document.createElement("div")
    playerDivElement.append(document.createElement("p"))
    playerDivElement.setAttribute("data-name",name)
    playerDivElement.firstElementChild.textContent = name
    playerDivElement.classList.add("playerCharSprite")
    let playerImgElement = document.createElement("img")
    gsap.set(playerImgElement,{
        x:0,
        y:0
    })
    playerDivElement.append(playerImgElement)
    map.append(playerDivElement)
    gsap.set(playerDivElement,{
        x:0,
        y:0,
    })
    playerImgElement.src = sprite
}
function removePlayerFromGame(name){
    const index = players.indexOf(name)
    players.splice(index,1)
    if (name===user) return
    document.querySelectorAll(".playerCharSprite").forEach(function (playerSprite){
        if (playerSprite.getAttribute("data-name") === name){
            playerSprite.remove()
        }
    })
}
function updatePlayerPosition(name,x,y,plrSrc){
    if (name === user) return
    checkIfPlayerExists(name,plrSrc)
    document.querySelectorAll(".playerCharSprite").forEach(function (playerSprite){
        if (playerSprite.getAttribute("data-name") === name){
            gsap.set(playerSprite,{
                x:(-x)+offsetX,
                y:(-y)+offsetY,
            })
            playerSprite.lastElementChild.src = plrSrc

        }
    })
}

function moveOtherPlayers(direction){
    if (direction==="none"){return}
    document.querySelectorAll(".playerCharSprite").forEach(function (playerSprite){
        if (playerSprite.getAttribute("data-name") !== user){
            let moveRule
            if (direction==="right" || direction==="back"){
                moveRule = `-=${SPEED}`
            }else{
                moveRule = `+=${SPEED}`
            }
            if (direction==="back"||direction==="front"){
                gsap.set(playerSprite,{
                    y:moveRule,
                })
            }else{
                gsap.set(playerSprite,{
                    x:moveRule,
                })
            }
        }
    })
}