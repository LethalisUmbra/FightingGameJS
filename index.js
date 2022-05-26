const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: { x: 600, y: 243 },
    imageSrc: './img/decorations/shop_anim.png',
    scale: 2,
    framesMax: 6
})

const player = new Fighter({
    position: { x: 0, y: 50 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/samurai/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 225,
        y: 175
    },
    sprites: {
        idle: { imageSrc: './img/samurai/Idle.png', framesMax: 8 },
        run: { imageSrc: './img/samurai/Run.png', framesMax: 8 },
        attack: { imageSrc: './img/samurai/Attack1.png', framesMax: 6 },
        jump: { imageSrc: './img/samurai/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/samurai/Fall.png', framesMax: 2 },
        takeHit: { imageSrc: './img/samurai/TakeHit2.png', framesMax: 4 },
        death: { imageSrc: './img/samurai/Death.png', framesMax: 6 }
    },
    attackBox: {
        offset: { x: 105, y: 15 },
        width: 135,
        height: 50
    }
})

const enemy = new Fighter({     
    position: { x: 800, y: 50 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 205,
        y: 190
    },
    sprites: {
        idle: { imageSrc: './img/kenji/Idle.png', framesMax: 4 },
        run: { imageSrc: './img/kenji/Run.png', framesMax: 8 },
        attack: { imageSrc: './img/kenji/Attack1.png', framesMax: 4 },
        jump: { imageSrc: './img/kenji/Jump.png', framesMax: 2 },
        fall: { imageSrc: './img/kenji/Fall.png', framesMax: 2 },
        takeHit: { imageSrc: './img/kenji/TakeHit.png', framesMax: 3 },
        death: { imageSrc: './img/kenji/Death.png', framesMax: 7 }
    },
    attackBox: {
        offset: {x: -145, y: 30},
        width: 120,
        height: 50
    }
})

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
}

decreaseTimer()

let animation
function animate() {
    animation = requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()

    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    
    player.update()
    enemy.update()

    // Fighters animations
    fighterAnimation({fighter: enemy})
    fighterAnimation({fighter: player})

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    } else {
        player.velocity.x = 0
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    } else {
        enemy.velocity.x = 0
    }

    // Player Attacking
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        gsap.to('#enemyHealth', {width: enemy.health + '%'})
    }
    // Stop attack
    if (player.isAttacking && player.framesCurrent === 4 ) {
        player.isAttacking = false
    }

    // Enemy Attacking
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit()
        gsap.to('#playerHealth', {width: player.health + '%'})
    }
    // Stop attack
    if (enemy.isAttacking && enemy.framesCurrent === 2 ) {
        enemy.isAttacking = false
    }

    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy})
    }
}

animate()

addEventListener('keydown', (event) => {
    if(!player.dead){
        switch (event.key) {
            case 'd':
            case 'D':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
            case 'A':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
            case 'W':
                if (player.velocity.y == 0) player.velocity.y = -15
                break
            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                if (enemy.velocity.y == 0) enemy.velocity.y = -15
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
    
})

addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
        case 'D':
            keys.d.pressed = false
            break
        case 'a':
        case 'A':
            keys.a.pressed = false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})