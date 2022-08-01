function rectangularCollision({ rectangle1,rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
            rectangle2.position.x && // Check where is the hitbox position on x-axis of the player     
        rectangle1.attackBox.position.x <= 
            rectangle2.position.x + rectangle2.width &&              // Check where is the hitbox position on x-axis of the enemy
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= 
            rectangle2.position.y &&  // Check where is the hitbox position on y-axis of the player
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId); //Stops time when player health or enemy health finishes
    document.querySelector('#displayText').style.display= 'flex';
    if (player.health === enemy.health){
        // Game ends with a tie
        document.querySelector('#displayText').innerHTML= 'TIE';
        
    } else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML= 'PLAYER 1 WINS';

    }else if (player.health < enemy.health){
        document.querySelector('#displayText').innerHTML= 'PLAYER 2 WINS';

    }
}
let timer = 60;
let timerId;
function decreaseTimer(){
   
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;   
    }
    if(timer==0){
        determineWinner({player, enemy, timerId})
    }

}