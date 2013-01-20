/*----------------------------
A title screen
-------------------------------*/

var TitleScreen = me.ScreenObject.extend({

    //constructor
    init: function() {
        this.parent(true);

        this.title = null;

        this.font = null;
        //this.scrollerfont = null;
        //this.scrollertween = null;

        //this.scroller = "title pls";
        //this.scroller = 600;
    },

    //reset function
    onResetEvent: function() {
        if (this.title == null) {
            //init if not yet
            this.title = me.loader.getImage("title_screen");
            //font
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");
/*
            //set scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");*/
        }
/*
        // reset to default value
        this.scrollerpos = 640;
 
        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
 */
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
        // play something (play doesn't loop, playTrack does)
        //me.audio.playTrack("BUY1");

    },

    // some callback for the tween objects
    //scrollover: function() {
        // reset to default value
      /*  this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();*/
//    },

    // draw function
    update: function() {
        //enter
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },

    draw: function(context) {
        context.drawImage(this.title, 0, 0);

        //this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
       // this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },

    // destroy function
    onDestroyEvent: function(){
        me.input.unbindKey(me.input.KEY.ENTER);
        //just in case
        //this.scrollertween.stop();
    }


});

/*-----------------
A score HUD Item
---------------------------*/
var ScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        //call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);

    },

    /*-----------
    draw dat score
    -------------*/

    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }


});


/*-----------------
A health HUD Item
---------------------------*/
var HealthObject = me.HUD_Item.extend({
    init: function(x, y) {
        //call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);

    },

    /*-----------
    draw dat score
    -------------*/

    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }


});

var playerX = 0;
var playerY = 0;
var playerD = 'e';

/*-------------------
a player entity
-------------------------------- */
var PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
 
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);

        this.gravity = 0;

        this.type = me.game.PLAYER;
 
        // set the display to follow our position on both axis
        //me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
 
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            updatePlayerDirection('w');
            console.log(playerD);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            updatePlayerDirection('e');
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed('up')) {
            // update the entity velocity
            this.vel.y -= this.accel.y * me.timer.tick;
            updatePlayerDirection('n');
        }  
        else if (me.input.isKeyPressed('down')) {
            // update the entity velocity
            this.vel.y += this.accel.y * me.timer.tick;
            updatePlayerDirection('s');
        }  
        else {
            this.vel.x = 0;
            this.vel.y = 0;
        }

        // Combat
        // Shoot or melee regardless of movement
        if(me.input.isKeyPressed('shoot')) {
            console.log("Bullet fired");
            var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                spritewidth: 32, spriteheight: 32, width: 1, height: 1});
            me.game.add(shot, this.z);
            me.game.sort();
            // Play animation?
        }
        else if(me.input.isKeyPressed('melee')) {
            console.log("MELEE");
            // Play melee animation
            // Test melee
        }
        else {

        }

        if (me.input.isKeyPressed('spawn')) {
            spawnCoin(this.pos.x, this.pos.y, this.z);
            /*
            var newCoin = new CoinEntity(this.pos.x, this.pos.y, {image: 'spinning_coin_gold', spritewidth: 32, spriteheight: 32});
          me.game.add(newCoin, this.z);
          //me.game.add(new EnemyEntity(5, 5,{}), 3);
          me.game.sort();
          console.log("fuck yea");*/
         } 
         if (me.input.isKeyPressed('spawnEnemy')) {
            spawnEnemy(this.pos.x, this.pos.y, this.z, 'Wheelie');
         }
        /*
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            if (!this.jumping && !this.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.vel.y = -this.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.jumping = true;
            }

 
        }*/
 
        // check & update player movement
        this.updateMovement();

        updatePlayerLocation(this.pos.x, this.pos.y);

        // check for collision
        var res = me.game.collide(this);
     
        if (res) {
            // if we collide with an enemy
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                // check if we jumped on it
                /*
                if ((res.y > 0) && ! this.jumping) {
                    // bounce (force jump)
                    this.falling = false;
                    this.vel.y = -this.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.jumping = true;
     
                }
                else { */
                    // let's flicker in case we touched an enemy
                    this.flicker(45);
                //}
            }
        }
 
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
 
});


/*----------------
 Spawn new object
 Params: x, y = spawn location of object
         z = z-buffer depth
 ----------------*/ 
function spawnCoin(x, y, z){
    var newCoin = new CoinEntity(x, y, {image: 'spinning_coin_gold', spritewidth: 32, spriteheight: 32});
          me.game.add(newCoin, z);
          me.game.sort();
}

/*----------------
 Spawn new enemy
 Params: x, y = spawn location of enemy
         z = z-buffer depth
         type = type of enemy
 ----------------*/ 
 //Add horde spawn (with random position offset)
function spawnEnemy(x, y, z, type){
    var newEnemy = new EnemyEntity(x, y, {image: 'wheelie_right', spritewidth: 64,
     spriteheight: 64, width: 4, height: 2});
          me.game.add(newEnemy, z);
          me.game.sort();
}

/*----------------
 a Coin entity
------------------------ */
var CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        settings.image = "spinning_coin_gold";
        settings.spritewidth = 32;
        settings.spriteheight = 32;
        // call the parent constructor
        this.parent(x, y, settings);

        this.type = me.game.ITEM;
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
        // do something when collected
        incScore();
    }
 
});

/*----------------
   Bullet Entity
------------------------ */
var BulletEntity = me.ObjectEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        //settings.image = "bullet_right";
        //settings.spritewidth = 32;
        //settings.spriteheight = 32;
        // call the parent constructor
        this.parent(x, y, settings);

        this.gravity = 0;
        this.collidable = true;

        // Change velocity based on direction user is facing
        if(playerD == 'n') {
            this.vel.y = -8;
        }
        else if(playerD == 's') {
            this.vel.y = 8;
        }
        else if(playerD == 'w') {
            this.vel.x = -8;
        }
        else {
            this.vel.x = 8;
        }

    },
 
    update: function () {
        
        if (!this.visible){
            // remove myself if not on the screen anymore
            me.game.remove(this);
        }
        
        /*
        if(this.vel.y < 0) {
            this.vel.y -= -2;
        }
        else if(this.vel.y > 0) {
            this.vel.y += 2;
        }
        else if(this.vel.x < 0) {
            this.vel.x -= 2;
        }
        else {
            this.vel.x += 2;
        }*/


        var collision = this.updateMovement();
        
        //if(collision.y = 0 && collision.yprop.isSolid && collision.obj.type != me.game.PLAYER) {
        if(collision.y != 0 || collision.x != 0) {
                me.game.remove(this);
        }

        // check for collision
        var res = me.game.collide(this);
        if (res) {
            if (res.obj.type == me.game.ENEMY_OBJECT) {
                //log points and play sound
                console.log("bullet hit enemy");
                
                
                //remove object
                me.game.remove(this);
                me.game.remove(res.obj);
            }
            //else if (collision.x == 0 || collision.y == 0) {
            /*
            else if(res.y != 0 || res.x != 0) {
                me.game.remove(this);
            }*/
            else if (res.obj.type == me.game.PLAYER || res.obj.type == me.game.ITEM) {

            }
            else {
                me.game.remove(this);
            }
            // Handle wall collisions
        }

        //this.computeVelocity(this.vel);
        //this.pos.add(this.vel);

        return true;
    }
 
});

/*------------
Helper function and vars for grabbing the player's location and direction
-------------*/

function updatePlayerLocation(x, y) {
    playerX = x;
    playerY = y;
}

function updatePlayerDirection(d) {
    playerD = d;
}

/* --------------------------
an enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "wheelie_right";
        settings.spritewidth = 64;
 
        // call the parent constructor
        this.parent(x, y, settings);
        this.gravity = 0;
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        this.walkLeft = true;

        //For y axis movement
        this.startY = y;
        this.walkUp = true;
 
        // walking & jumping speed
        this.setVelocity(0.5, 0.5);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        decHealth();
 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        /*
        if (this.alive) {

        }*/
        /*
        if (this.alive && (res.y > 0) && obj.falling) {
            this.flicker(45);
        }*/
    },
 
    // manage the enemy movement
    update: function() {
        //console.log(playerX);
        // do nothing if not visible
        if (!this.visible)
            return false;
 
        if (this.alive) {
            /*
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }*/
            //Follow the player in the x axis
            if (this.walkLeft && this.pos.x <= playerX) {
                this.walkLeft = false;
            }
            else if (!this.walkLeft && this.pos.x >= playerX) {
                this.walkLeft = true;
            }
            //Follow the player in the y axis
            if (this.walkUp && this.pos.y <= playerY) {
                this.walkUp = false;
            }
            else if (!this.walkUp && this.pos.y >= playerY) {
                this.walkUp = true;
            }
            // make it walk
            //x axis
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
            //y axis
            //this.flipX(this.walkLeft);
            this.vel.y += (this.walkUp) ? -this.accel.y * me.timer.tick : this.accel.y * me.timer.tick;
                 
        } else {
            this.vel.x = 0;
            this.vel.y = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
});


