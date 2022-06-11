const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight
canvas.width = 1024
canvas.height = 576

c.fillRect(0,0, canvas.width, canvas.height)
const gravity = 0.7
const xspeed = 10
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './imgs/background.png'
})


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -85,
        y: 0
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -85,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}
let lastKey

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -xspeed
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = xspeed
    }
    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -xspeed
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = xspeed
    }

    //detect collision yas
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && player.isAttacking) {
            console.log("yas")
            player.isAttacking = false // immediately sets is attacking to false again to allow for only one hit at a time
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && enemy.isAttacking) {
            console.log("enemy attack yas")
            enemy.isAttacking = false // immediately sets is attacking to false again to allow for only one hit at a time
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (player.jump == 0)
                player.velocity.y = -15
            else if (player.jump == 1)
                player.velocity.y = -12
            player.jump++
            break
        case ' ':
            player.attack()
            break
        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.jump == 0)
                enemy.velocity.y = -15
            else if (enemy.jump == 1)
                enemy.velocity.y = -12
            enemy.jump++
            break
        case 'ArrowDown':
            enemy.attack()
            break

    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        // case 'w':
        //     player.jump = 0
        //     break
        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        // case 'ArrowUp':
        //     enemy.jump = 0

    }
})