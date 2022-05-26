function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function determineWinner({player, enemy}) {
    clearTimeout(timerId)
    document.getElementById('displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.getElementById('displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.getElementById('displayText').innerHTML = 'Player 1 Wins'
    } else {
        document.getElementById('displayText').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0 ) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.getElementById('timer').innerHTML = timer
    }

    // Time running out
    if (timer === 0) {
        determineWinner({player, enemy})
    }
}

function fighterAnimation({fighter}){
    // Run
    if (fighter.velocity.x != 0 && fighter.velocity.y == 0) {
        fighter.switchSprite('run')
    } else if (fighter.velocity.y != 0) {
        // Jump
        if (fighter.velocity.y < 0) {
            fighter.switchSprite('jump')
        }
        // Fall
        else {
            fighter.switchSprite('fall')
        }
    }
    // Idle
    else {
        fighter.switchSprite('idle')
    }
}