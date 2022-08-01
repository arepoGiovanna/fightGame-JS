/*
Note:


*/ 

const canvas = document.querySelector('canvas'); // Select the element from the HTML page.
const c = canvas.getContext('2d');  // Select canvas context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

//Create gravity
const gravity = 0.7;


// Create enemy and player OBJECT
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    frameMax: 6 
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 100,
        y: 100
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    frameMax: 8, 
    offset:{
        x: 200,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            scale: 2.5,
            frameMax: 8, 
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            scale: 2.5,
            frameMax: 8, 

        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            scale: 2.5,
            frameMax: 2, 

        },
        fall:{
            imageSrc: './img/samuraiMack/Fall.png',
            scale: 2.5,
            frameMax: 2, 
        },
        attack1:{
            imageSrc: './img/samuraiMack/Attack1.png',
            scale: 2.5,
            frameMax: 6, 
        },
        takeHit:{
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            scale: 2.5,
            frameMax: 4, 
        },
        death:{
            imageSrc: './img/samuraiMack/Death.png',
            scale: 2.5,
            frameMax: 6, 
        }
    },
    attackBox: {
        offset:{
            x: 90,
            y: 50
        },
        width: 160,
        height: 50
    }
}
);

//player.draw(); // call the draw function to draw the player sprite

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
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    frameMax: 4, 
    offset:{
        x: 200,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            scale: 2.5,
            frameMax: 4, 
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            scale: 2.5,
            frameMax: 8, 

        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            scale: 2.5,
            frameMax: 2, 

        },
        fall:{
            imageSrc: './img/kenji/Fall.png',
            scale: 2.5,
            frameMax: 2, 
        },
        attack1:{
            imageSrc: './img/kenji/Attack1.png',
            scale: 2.5,
            frameMax: 4, 
        },
        takeHit:{
            imageSrc: './img/kenji/Take hit.png',
            scale: 2.5,
            frameMax: 3, 
        },
        death:{
            imageSrc: './img/kenji/Death.png',
            scale: 2.5,
            frameMax: 7, 
        }
    },
    attackBox: {
        offset:{
            x: -160,
            y: 50
        },
        width: 160,
        height: 50
    }
}
);

enemy.draw(); // call the draw function to draw the enemy sprite

console.log(player);


// Create animation function
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }, 
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}
//let lastKey;

decreaseTimer();

function animate(){ //ANIMATION LOOP
    window.requestAnimationFrame(animate); //Choose which function I want to loop over and over again
                                           //Recursive function
    c.fillStyle = 'pink'; // Canvas behind background
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'; // rgba(red, green, blue, alpha[opacity of the colour])
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    // Player and enemy set to 0 so that when key is up, they wo't
    // automatically walk around the canvas
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // PLAYER MOVEMENT
    // player.switchSprite('idle');
    if (keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -5;
        player.switchSprite('run');
    }else if (keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = 5;
        player.switchSprite('run');
    }else {
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0){ // jump
        player.switchSprite('jump');
    }else if (player.velocity.y > 0){ // falling
        player.switchSprite('fall');
    }

    // enemy movement

    //REMEMBER TO ALWAYS CALL THE ENEMY OBJECT TO DIFFERENTIATE THE SPRITE
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }else{
        enemy.switchSprite('idle');
    }

    if(enemy.velocity.y < 0){ // jump
        enemy.switchSprite('jump');
    }else if (enemy.velocity.y > 0){ // falling
        enemy.switchSprite('fall');
    }

    // DETECT FOR COLLISION //PLAYER & Enemy gets hit
    if( rectangularCollision({rectangle1: player,rectangle2: enemy})&&  player.isAttacking && player.frameCurrent === 4){ // 4 is the 4th frame of the attack
        enemy.takeHit()
        player.isAttacking = false; // Hit them once
        console.log('Player punch!');
       
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'; // Decreases Enemy health
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // If player misses
    if(player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false;
    }
    // DETECT FOR COLLISION //ENEMY & player gets hit
    if( rectangularCollision({rectangle1: enemy,rectangle2: player})&&  enemy.isAttacking && enemy.frameCurrent === 2){
        player.takeHit();
        enemy.isAttacking = false; // Hit them once
        console.log('Enemy punch!');
         
        //document.querySelector('#playerHealth').style.width = player.health + '%'; // Decreases Player health
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // If enemy misses
    if(enemy.isAttacking && enemy.frameCurrent === 2){  // 2 is the 2nd frame of the attack
        enemy.isAttacking = false;
    }
    // end the game based on health
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate();

// Add event listeners to move sprites

// Move for player
window.addEventListener('keydown', (event) =>{
    //console.log(event.key); // Check what's the name of the arrow keys
    if(!player.dead){
        switch(event.key){
            // PLAYER
            case 'D':
            case 'd':
                // player.velocity.x = 1;
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'A':
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'W':
            case 'w':
                player.velocity.y = -20; // THis makes the player object shoot upwards. Hence, it created a "jump" effect.
                break;
            case ' ':
                player.attack();
                break;
        
        }          
    }

    if(!enemy.dead){
        switch(event.key){
        
            // ENEMY
            case 'ArrowRight':
                // player.velocity.x = 1;
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20; // THis makes the player object shoot upwards. Hence, it created a "jump" effect.
                break;
            case 'k':
                //enemy.isAttacking = true;
                enemy.attack();
                break;
        }
    }

    //console.log(event.key);
})

window.addEventListener('keyup', (event) =>{
    // PLAYER
    switch(event.key){
        case 'D':
        case 'd':
            // player.velocity.x = 0;
            keys.d.pressed = false;
            break;
        case 'A':
        case 'a':
            keys.a.pressed = false;
            break;
    }

    // enemy keys
    switch(event.key){
        case 'ArrowRight':
            // player.velocity.x = 0;
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }


    //console.log(event.key);
})