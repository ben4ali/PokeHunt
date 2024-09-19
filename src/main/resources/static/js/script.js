//Elements
const battleScene = document.getElementById("pokeBattle")

//Ennemy menu & Player menu
const ennemyMenu = document.querySelector("#ennemyS .menu")
const playermenu = document.querySelector("#playerS .menu")
//Ennemy gBatch & Player gBatch
const ennemyGrass = document.querySelector("#ennemyS .grass")
const playerGrass = document.querySelector("#playerS .grass")
//Enemy pokemon sprite holder
const ennemySprite = document.querySelector("#ennemyS .sprite")

//sprites
const ennemyImg = document.querySelector("#ennemyS .sprite").firstElementChild
const playerImg = document.querySelector("#playerS .sprite").firstElementChild

const ennemyPkmName = document.getElementById("ennemyPkmName")
const playerPkmName = document.getElementById("playerPkmName")

const ennemyHpBar = ennemyMenu.querySelector(".hpBar")
const playerHpBr = playermenu.querySelector(".hpBar")

const optionsMenu = document.querySelector(".options")
const dialogText = document.getElementById("dialogText")

const sparkleGif = document.getElementById("shinySparkle")

const optionBtnHolder = document.querySelector(".optionBtnHolder")
const fightBtnHolder = document.querySelector(".fightBtnHolder")
const moveInfo = fightBtnHolder.querySelector(".moveInformation")
const fightBtns = fightBtnHolder.querySelectorAll("button")
const backFightBtn = document.getElementById("backBtn")

const FIGHTBTN = optionBtnHolder.querySelector(".fight")
const BAGBTN = optionBtnHolder.querySelector(".bag")
const POKEMONBTN = optionBtnHolder.querySelector(".pokBtn")
const RUNBTN = optionBtnHolder.querySelector(".run")

const powerInfo = document.getElementById("powerInfo")
const typeInfo = document.getElementById("typeInfo")

//Audios
const mainMusic = document.getElementById("mainMusic")
const encounterMusic = document.getElementById("encounterMusic")
const shinySound = document.getElementById("shinySound")

//CONSTANTS
const POKEMONS_MAX = 649
const DURATION = 1
const DELAY = 0.1
const SHINY_ODDS = 2
const ENCOUNTER_ODDS = 100 //by default 100

//VARIABLES
let encounter = true



//Pokemon data

//Player
const playerPokemon = {
    name:"",
    number:150,
    type:"",
    type2:"",
    hp:"",
    height:"",
    capture_rate:"",
    movesURL: ["","","",""],
    movesData:[],
    status:"None",
    shiny:"no",
    gender:"male"
}

const ennemyPokemon = {
    name:"",
    number:"",
    type:"",
    type2:"",
    hp:"",
    height:"",
    capture_rate:"",
    movesURL: ["","","",""],
    movesData:[],
    status:"None",
    shiny:"no",
    gender:""
}

const POKEMON_TYPES_WEAKNESS_CHART = {
    "normal":["fighting"],
    "fighting":["flying","psychic","fairy"],
    "flying":["rock","electric","ice"],
    "poison":["ground","psychic"],
    "ground":["water","grass","ice"],
    "rock":["fighting","ground","steel","water","grass"],
    "bug":["flying","rock","fire"],
    "ghost":["ghost","dark"],
    "steel":["fighting","ground","fire"],
    "fire":["rock","water","fire","dragon"],
    "water":["grass","electric"],
    "grass":["flying","poison","bug","fire","ice"],
    "electric":["ground"],
    "psychic":["bug","ghost","dark"],
    "ice":["fighting","rock","steel","fire"],
    "dragon":["ice","dragon"],
    "dark":["fighting","bug","fairy"],
    "fairy":["poison","steel"]
}

playerImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/"+playerPokemon.number+".gif"



function startEncounter(){
    const ennemyPokemonNbr = getRandomInt(POKEMONS_MAX)

    //Ennemy
    let shinyToken = getRandomInt(SHINY_ODDS)
    if (shinyToken==1){
        ennemyPokemon.shiny = "yes"
    }

    let genderToken = getRandomInt(2)
    if (genderToken==1){
        ennemyPokemon.gender = "Female"
    }

    fetch('https://pokeapi.co/api/v2/pokemon/'+ennemyPokemonNbr+'/')
        .then(response => response.json())
        .then(data => {

            ennemyPokemon.name = data.name
            ennemyPokemon.number = ennemyPokemonNbr
            ennemyPokemon.height = data.height
            ennemyPokemon.hp = data.stats[0].base_stat
            ennemyPokemon.type = data.types[0].type.name
            try{
                ennemyPokemon.type2 = data.types[1].type.name
            }catch(error){
                ennemyPokemon.type2 = "none"
            }

            fetch('https://pokeapi.co/api/v2/pokemon-species/'+ennemyPokemon.number)
                .then(response => response.json())
                .then(data=>{
                    ennemyPokemon.capture_rate = data.capture_rate
                })
            ennemyPokemon.movesURL = [
                data.moves[0].move.url,
                data.moves[1].move.url,
                data.moves[2].move.url,
                data.moves[3].move.url,
            ]
            for (i=0; i<4;i++){
                fetch(ennemyPokemon.movesURL[i])
                    .then(response => response.json())
                    .then(data=>{
                        fullData = {
                            name:toTitleCase(data.name),
                            type:toTitleCase(data.type.name),
                            power:data.power
                        }
                        ennemyPokemon.movesData.push(fullData)
                    })

            }
            ennemyPkmName.textContent = toTitleCase(ennemyPokemon.name)
            if (ennemyPokemon.shiny==="yes"){
                ennemyImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/"+ennemyPokemon.number+".gif"
                shinyAppear()
            }else{
                initMenu()
                ennemyImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/"+ennemyPokemonNbr+".gif"
            }
        })

    //Player
    fetch('https://pokeapi.co/api/v2/pokemon/'+playerPokemon.number+'/')
        .then(response => response.json())
        .then(data => {
            playerPokemon.name = data.name

            playerPokemon.hp = data.stats[0].base_stat
            playerPokemon.type = data.types[0].type.name
            try {
                playerPokemon.type2 = data.types[1].type.name
            } catch (error) {
                playerPokemon.type2 = "none"
            }

            playerPokemon.height = data.height
            playerPokemon.movesURL = [
                data.moves[0].move.url,
                data.moves[1].move.url,
                data.moves[2].move.url,
                data.moves[3].move.url,
            ]

            fetch('https://pokeapi.co/api/v2/pokemon-species/'+playerPokemon.number)
                .then(response => response.json())
                .then(data=>{
                    playerPokemon.capture_rate = data.capture_rate
                })

            for (i=0; i<4;i++){
                fetch(playerPokemon.movesURL[i])
                    .then(response => response.json())
                    .then(data=>{
                        fullData = {
                            name:data.name.toUpperCase(),
                            type:data.type.name.toUpperCase(),
                            power:data.power
                        }
                        playerPokemon.movesData.push(fullData)
                    })
            }

            playerPkmName.textContent = toTitleCase(playerPokemon.name)
            console.log(playerPokemon)
        })


    //Animations
    setEnnemyScene()

}
function setEnnemyScene(){
    gsap.to(ennemyGrass,{
        x:0,
        scale:1,
        duration:DURATION,
        delay:DELAY+0.2,
        ease:"cubic"
    })
    gsap.to(ennemySprite.firstElementChild,{
        x:0,
        scale:1,
        duration:DURATION,
        delay:DELAY+0.2,
        opacity:1,
        ease:"cubic"
    })
    gsap.to(playerGrass,{
        x:0,
        duration:DURATION,
        delay:DELAY,
        ease:"cubic"
    })

    gsap.to(playerImg,{
        x:0,
        delay:DELAY+0.4,
        opacity:1
    })

}

function initMenu(){
    gsap.to(optionsMenu,{
        y:0,
        delay:0.8,
        onComplete: ()=>{
            gsap.to(dialogText,{
                text: "What will "+ toTitleCase(playerPokemon.name) +" do ?"
            })
            gsap.to(optionsMenu.lastElementChild.children,{
                stagger:0.1,
                opacity:1,
                delay:0.1
            })
        }
    })
    gsap.to(ennemyMenu,{
        x:0,
        delay:0.5,
    })
    gsap.to(playermenu,{
        x:0,
        delay:0.6,
    })
}
function transition(){
    mainMusic.pause()
    encounterMusic.play()
    encounter = true
    resetEncounterDisplay()

    transitionFrame.style.display="block"
    gsap.to(map,{
        scale:2.5,
        duration:0.5,
        ease:"back.inOut(1)",onComplete:()=>{
            gsap.to(transitionFrame,{
                backgroundColor:"white",
                duration:0.2,
                repeat:5,
            })
        }
    })


    const divs = transitionFrame.children
    for (let i=0; i<divs.length; i++){
        gsap.set(divs[i].children,{
            opacity:0
        })
    }

    gsap.to(transitionFrame,{
        opacity:1,
        delay:0.4,
        onComplete:()=>{
            const divs = transitionFrame.children
            player.style.display="none"
            for (let i=0; i<divs.length; i++){
                gsap.set(divs[i].children,{
                    opacity:1
                })
                gsap.to(divs[i].children,{
                    opacity:0,
                    duration:0.5,
                    delay:0.4*i,
                    stagger:0.1,
                    ease:"cubic"
                })
            }
            gsap.set(battleScene,{
                display:"block"
            })
            gsap.to(battleScene,{
                opacity:1,
                delay:0.1
            })
            gsap.to(transitionFrame,{
                opacity:0,
                duration:0.5,
                delay:2.4,
                onComplete:()=>{
                    startEncounter()
                    transitionFrame.style.display="none"
                }
            })
        }
    })
}
function run(){
    encounterMusic.pause()
    encounterMusic.currentTime = 0
    gsap.set(transitionFrame,{
        display:"block",
        opacity:0,
        backgroundColor:"black"
    })
    gsap.to(transitionFrame,{
        opacity:1,
        duration:0.5,
        onComplete:()=>{
            gsap.set(battleScene,{
                display:"none",
                opacity:0
            })
            gsap.set(map,{
                scale:1,
            })
            player.style.display="block"
            gsap.to(transitionFrame,{
                opacity:0,
                duration:0.5,
                delay:0.5,
                onComplete:()=>{
                    transitionFrame.style.display="none"
                    encounter = false
                    mainMusic.play()
                }
            })
        }
    })
}
function fight(){
    fightBtnHolder.style.display="flex"
    optionBtnHolder.style.display="none"
    for (let i=0; i<fightBtns.length; i++){
        fightBtns[i].textContent = playerPokemon.movesData[i].name
        fightBtns[i].addEventListener("mouseover",()=>{
            addInfoHoverListeners(fightBtns[i], i)
        })
        addAttackEventListeners(fightBtns[i], i)
    }
}
function attack(move, dstPokemon){
    if (dstPokemon.hp<=0){return}
    let damage = move.power
    let effectiveness = 1
    if (POKEMON_TYPES_WEAKNESS_CHART[move.type.toLowerCase()].includes(dstPokemon.type)){
        effectiveness = 2
    }
    let randomiser = getRandomInt(2)
    if (randomiser==1){
        effectiveness = effectiveness*1.5
    }else if (randomiser==0){
        effectiveness = effectiveness*0.5
    }
    damage = damage*effectiveness
    dstPokemon.hp = dstPokemon.hp-damage
    if (dstPokemon.hp<=0){
        dstPokemon.hp = 0
        if (dstPokemon==ennemyPokemon){
            gsap.to(dialogText,{
                text: toTitleCase(dstPokemon.name)+" fainted !",
                delay:3,
            })
            gsap.to(ennemySprite,{
                y:200,
                delay:3,
                opacity:0,
                duration:1,
                ease:"back.in(3)",
                onComplete:()=>{

                    setTimeout(()=>{run()
                        gsap.set(ennemySprite,{
                            y:0,
                            opacity:1,
                            delay:2
                        })
                        gsap.set(ennemyHpBar,{
                            width:"100%",
                            delay:2
                        })
                    },2000)

                }
            })
        }
    }else{
        if (effectiveness==2){
            gsap.to(dialogText,{
                text: "It was super effective !",
                delay:3.5,
                duration:0.4,
            })
        }else if (effectiveness==0.5){
            gsap.to(dialogText,{
                text: "It was not very effective...",
                delay:3.5,
                duration:0.4,
            })
        }
        else{
            gsap.to(dialogText,{
                text: "It was effective !",
                delay:3.5,
                duration:0.4,
            })
        }
        gsap.to(dialogText,{
            text: "",
            delay:5.5,
            duration:0.4,
            onComplete:()=>{
                gsap.to(dialogText,{
                    text:"What will "+ toTitleCase(playerPokemon.name) +" do ?"
                })
            }
        })
    }

    if (dstPokemon==ennemyPokemon){
        gsap.to(dialogText,{
            text: toTitleCase(playerPokemon.name)+" used "+move.name+" dealing "+damage+" damage to "+toTitleCase(dstPokemon.name)+" !",
            onComplete:()=>{
                gsap.to(dialogText,{
                    text:"",
                    delay:2,
                })
                gsap.to(ennemyHpBar,{
                    width:dstPokemon.hp+"%",
                    duration:1,
                    delay:1.5
                })

                gsap.to(playerImg,{
                    x:40,
                    y:-20,
                    duration:0.1,
                    delay:1.5,
                    onComplete:()=>{
                        gsap.to(playerImg,{
                            y:0,
                            x:0,
                            duration:0.1
                        })
                    }
                })
                gsap.to(ennemySprite,{
                    x:10,
                    y:-10,
                    repeat:2,
                    duration:0.1,
                    delay:1.5,
                    onComplete:()=>{
                        gsap.to(ennemySprite,{
                            x:0,
                            y:0,
                            duration:0.1
                        })
                    }
                })
            }
        })
    }
}
function addInfoHoverListeners(element, index){
    powerInfo.textContent = "Power: "+playerPokemon.movesData[index].power
    typeInfo.textContent = "Type: "+playerPokemon.movesData[index].type
}
function addAttackEventListeners(move,index){
    move.addEventListener("click",()=>{
        attack(playerPokemon.movesData[index], ennemyPokemon)
        hideFightMenu()
    })
}
function hideFightMenu(){
    fightBtnHolder.style.display="none"
    optionBtnHolder.style.display="grid"
    //remove event listeners
    for (let i=0; i<fightBtns.length; i++){
        fightBtns[i].removeEventListener("mouseover",()=>{
            addInfoHoverListeners(fightBtns[i], i)
        })
        fightBtns[i].removeEventListener("click",()=>{
            attack(playerPokemon.movesData[i], ennemyPokemon)
        })
    }
}
function resetEncounterDisplay(){
    gsap.set(optionsMenu,{
        y:800,
    })
    gsap.set(ennemyMenu,{
        x:-500,
    })
    gsap.set(playermenu,{
        x:900,
    })

    gsap.set(ennemyGrass,{
        x:700,
        scale:0.5,
    })
    gsap.set(ennemySprite.firstElementChild,{
        x:800,
        scale:0.5,
        opacity:0,
    })
    gsap.set(playerGrass,{
        x:-1000,
    })

    gsap.set(playerImg,{
        x:-500,
        opacity:0
    })
}
function shinyAppear(){
    gsap.to(sparkleGif,{
        delay:DELAY+1,
        display:"block",
        duration:1,
        onComplete:()=>{
            sparkleGif.style.display="none"
            initMenu()
        }
    })
    setTimeout(()=>{
        shinySound.currentTime = 0
        shinySound.play()
    },DELAY+1*1000)
}


const transitionFrame = document.querySelector(".transitionFrame")


RUNBTN.addEventListener("click",()=>{
    run()
})
FIGHTBTN.addEventListener("click",()=>{
    fight()
})
backFightBtn.addEventListener("click",()=>{
    hideFightMenu()
})




// startEncounter()

//Functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}


//Init
//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/206.gif




const overworldContainer = document.getElementById("overworld")
const map = document.querySelector(".map")
const player = document.getElementById("playerCharacterSprite")


let SPEED = 15
let walking = false
let direction = "front"

document.addEventListener("keyup", (e)=>{

    if (e.key==="w"){
        direction="front"
        player.lastElementChild.src = "../assets/images/frontIdle.png"
    }
    if (e.key==="s"){
        direction="back"
        player.lastElementChild.src = "../assets/images/backIdle.png"
    }
    if (e.key==="a"){
        direction="left"
        player.lastElementChild.src = "../assets/images/leftIdle.png"
    }
    if (e.key==="d"){
        direction="right"
        player.lastElementChild.src = "../assets/images/rightIdle.png"
    }
    setTimeout(()=>{
        walking = false
    },500)
})






resetEncounterDisplay()



