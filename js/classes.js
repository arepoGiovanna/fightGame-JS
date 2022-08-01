// Create sprite
class Sprite{ //Parent class
    // Dont worry, this function will be automatically created
    // {} This is wrapping property.
    // Default of frameMax is 1.
    constructor({position, imageSrc, scale = 1, frameMax = 1, offset = {x: 0, y: 0}}){
        this.position = position;
        // gravity
        //this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.image = new Image(); //native API
        this.image.src = imageSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.frameCurrent = 0;
        this.frameElapsed = 0; //How many frames have elapsed over
        this.frameHold = 11;   // How many frames should we actually go through before frameCurrent (the actual animation)
                                //  For every 11th frame, we're going to loop through this animation
        this.offset = offset;
    }

    draw(){
        /**
         * 
         * (OLD) 6 is the framerate of the shop.png.
         * crop it to get animated.
         * 
         * frameMax is the property to make the max ammount of frames.
         * 
         */
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.frameMax), // x axis (shop animation)
            0, // y axis (shop animation)
            this.image.width / this.frameMax, // shop.png
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.frameMax) * this.scale, 
            this.image.height * this.scale

            ); // Draw the background
    }

    animateFrames(){
        this.frameElapsed++;
        // This code creates the animation loop for the shop.png
        // This also prevents the background from flickering.
        if(this.frameElapsed % this.frameHold === 0){
            if(this.frameCurrent < this.frameMax - 1){
                this.frameCurrent++;    
            }else{
                this.frameCurrent = 0;
            }
        }
    }
    update(){
        this.draw();
        this.animateFrames();
    }

}

//Create fighter sprite
class Fighter extends Sprite{ // Inherit the properties from Sprite class
    // Dont worry, this function will be automatically created
    // {} This is wrapping property.
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        frameMax = 1, 
        offset = {x: 0, y: 0}, 
        sprites, 
        attackBox = {offset: {}, width: undefined, height: undefined}
    }){
        super({
            imageSrc,
            scale,
            frameMax,
            position,
            offset
        }); // Calls the the constructor of the parent.
            // Make sure the arguments in the super are the same as in the parent constructor
        
        // gravity
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x, 
                y: this.position.y
            },
            offset: attackBox.offset, // same as offset: offset. To make the code cleaner
            width: attackBox.width,
            height: attackBox.height
        }; // player and enemy attacking each other
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.frameCurrent = 0;
        this.frameElapsed = 0; //How many frames have elapsed over
        this.frameHold = 11; 
        this.sprites = sprites;
        this.dead = false;

        // declare sprite as const because sprite is never gonna change.
        for(const sprite in this.sprites){
            // V -- This is the object we want to loop over
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

        console.log(this.sprites);

    }

    update(){
        this.draw();
        
        if(!this.dead) this.animateFrames();

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x; // hitbox follows the position of the player
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y; // hitbox follows the position of enemy
        
        // Draw the attack box
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        
        
        // this.velocity.y += gravity;
        // YOU WANT TO MAKE THE ENEMY AND PLAYER TO FALL
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; // THis is for the jump effect.

        // GRAVITY FUNCTION
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96){
            this.velocity.y = 0;
            this.position.y = 330;
        }else this.velocity.y += gravity;

        console.log(this.position.y)
    }

    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true; // Always attacking on all times but is activated on certain period of times
    //     setTimeout(() => {
    //         this.isAttacking = false
    //     }, 100) // 100 represents milliseconds so after 100 ms, isAttacking will be set to false
    }

    takeHit(){
        
        this.health -= 20;

        if(this.health <= 0){
            this.switchSprite('death');
        }else this.switchSprite('takeHit');
    }

    // Abstracting the jump code from index.js.
    switchSprite(sprite){
        // Check if the player or enemy has died
        if(this.image === this.sprites.death.image){
           if(this.frameCurrent === this.sprites.death.frameMax - 1){
            this.dead = true;
           }
            return
        } 

        // Overriding all other animations with the attack animation
        if(this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.frameMax - 1){
                return;
            }
                
        // Override when fighter gets hit
        if(this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.frameMax - 1){
            return;
        }
        switch(sprite){
            case 'idle': 
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax;
                    this.frameCurrent = 0;
                }
                
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.frameMax = this.sprites.run.frameMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;   
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;   
                    this.frameCurrent = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.frameMax = this.sprites.attack1.frameMax;   
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.frameMax = this.sprites.takeHit.frameMax;   
                    this.frameCurrent = 0;
                }
            break;
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.frameMax = this.sprites.death.frameMax;   
                    this.frameCurrent = 0;
                }
                break;

        }
    }

        /**===========================================================================
     * DO NOT DELETE THIS COMMENT HERE. THIS IS THE HITBOX CODE FOR EDUCATION PURPOSES
     * ===========================================================================
     */
    // draw(){
    //     c.fillStyle = this.color;
    //     //         Reference to x   Reference to y   static values
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height)
        
    //     //Attack box
    //     if(this.isAttacking){ // If player spacebar attacking is TRUE, then summon the green box (prevents confusion)
    //         c.fillStyle = 'green';
    //         c.fillRect(
    //             this.attackBox.position.x, 
    //             this.attackBox.position.y, 
    //             this.attackBox.width, 
    //             this.attackBox.height);
    //     }
    // }
}