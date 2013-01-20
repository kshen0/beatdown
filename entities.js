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

        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
       // this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },

    // destroy function
    onDestroyEvent: function(){
        me.input.unbindKey(me.input.KEY.ENTER);
        //just in case
        //this.scrollertween.stop();
    }


});

/*---------------------
A gameover screen
---------------------------*/

var GameOverScreen = me.ScreenObject.extend({

    //constructor
    init: function() {
        this.parent(true);

        this.title = null;
        this.font = null;
    },

    //reset function
    onResetEvent: function() {
        if (this.title == null) {
            //init if not yet
            this.title = me.loader.getImage("gameover_screen");
            //font
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");

        }

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
    },
    // draw function
    update: function() {
        //enter
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.MENU);
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


/*---------------
   Global vars
   ------------*/
var playerX = 0;
var playerY = 0;
var playerD = 'e';
var poweredUp = false;
var powerUpCoolDown = 0;
var powerUpType = 0;
//0 = fast moving
//1 = rapid fire
//2 = SUPERNOVA
var coolDown = 0;
// inc the score by certain amount everytime this hits a threshold, then reset
var scoreIncCount = 0;
// flickering bool since is flickering won't work for me
var isFlickering = false;
var supernova = false;

var lowOn = false;
var midOn = false;
var highOn = false;

var lastTimeInterval; 

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
        
        lastTimeInterval = me.timer.getTime();
        // set the display to follow our position on both axis
        //me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
        var currentTime = me.timer.getTime();

        // enough time has passed; we can spawn
        if(currentTime - lastTimeInterval> 100) {
            lastTimeInterval = currentTime;
            checkSpawns();
        }

        if(poweredUp == true && powerUpCoolDown == 0) {
            powerUpCoolDown = 200;
            powerUpType = Math.floor((Math.random()*2));
            //powerUpType = 2;

            /*
            if(powerUpType == 2) {
                powerUpCoolDown = 0;
                poweredUp = false;
                if(supernova == true) {
                    powerUpType = 0;
                } 
                supernova = !supernova;
                
                var allEnemies = [];
                allEnemies = me.game.getEntityByName('enemy1');
                for(var i = 0; i < allEnemies.length; i++) {
                    //console.log(i);
                    me.game.remove(allEnemies[i], true);
                }
                //repaint();
            }*/
            /*

            FAST MOVING POWERUP OSDHF;ADSKDFJ;SALFJADS;FJAS;LDJFKL;ASD


            */
            if(powerUpType == 0) {
                this.setVelocity(6, 6);

                if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                updatePlayerDirection('w');
                //console.log(playerD);
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
                if(coolDown == 0) {
                    // Shoot or melee regardless of movement
                    
                    if(me.input.isKeyPressed('shootup')) {
                        coolDown = 8;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_up', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'up'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else if(me.input.isKeyPressed('shootleft')) {
                        coolDown = 8;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_left', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'left'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else if(me.input.isKeyPressed('shootdown')) {
                        coolDown = 8;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_down', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'down'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else if(me.input.isKeyPressed('shootright')) {
                        coolDown = 8;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'right'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else {

                    }
                } 

            }
            /*

            RAPID FIRE IHFSDIUHFDSAHFJLDSAJHFDSA OSDHF;ADSKDFJ;SALFJADS;FJAS;LDJFKL;ASD


            */
            else if(powerUpType == 1) {

                if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                updatePlayerDirection('w');
                //console.log(playerD);
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
                if(coolDown == 0) {
                    // Shoot or melee regardless of movement
                    
                    if(me.input.isKeyPressed('shootup')) {
                        coolDown = 5;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_up', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'up'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else if(me.input.isKeyPressed('shootleft')) {
                        coolDown = 5;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_left', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'left'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else if(me.input.isKeyPressed('shootdown')) {
                        coolDown = 5;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_down', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'down'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else if(me.input.isKeyPressed('shootright')) {
                        coolDown = 5;
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                            spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'right'});
                        me.game.add(shot, this.z);
                        me.game.sort();
                    }
                    else {

                    }
                } 

            }
        }
        else if(poweredUp == true && powerUpCoolDown != 0 && powerUpType == 0) {
            powerUpCoolDown = powerUpCoolDown - 1;

            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                updatePlayerDirection('w');
                //console.log(playerD);
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
            if(coolDown == 0) {
                // Shoot or melee regardless of movement
                if(me.input.isKeyPressed('shootup')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_up', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'up'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootleft')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_left', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'left'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootdown')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_down', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'down'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootright')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'right'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else {

                }
            }
        }
        else if(poweredUp == true && powerUpCoolDown != 0 && powerUpType == 1) {
            powerUpCoolDown = powerUpCoolDown - 1;

            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                updatePlayerDirection('w');
                //console.log(playerD);
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
            if(coolDown == 0) {
                // Shoot or melee regardless of movement
                
                if(me.input.isKeyPressed('shootup')) {
                    coolDown = 5;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_up', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'up'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootleft')) {
                    coolDown = 5;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_left', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'left'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootdown')) {
                    coolDown = 5;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_down', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'down'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootright')) {
                    coolDown = 5;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'right'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else {

                }
            }
        }

        //NOOOOOOOOOOOO POWER UPPPPPPPPPPPPPPP DSFKLHDASDFHIA;OSHFUIDLHFLSAJDFSA
        else {
            this.setVelocity(3, 3);
        
            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                this.flipX(true);
                updatePlayerDirection('w');
                //console.log(playerD);
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
            if(coolDown == 0) {
                // Shoot or melee regardless of movement
                if(me.input.isKeyPressed('shoot')) {
                    coolDown = 12;
                    //console.log("Bullet fired");
                    
                    if(playerD == 'n') {
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_up', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: false});
                    }
                    else if(playerD == 's') {
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_down', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: false});
                    }
                    else if(playerD == 'w') {
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_left', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: false});
                    }
                    else {
                        var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: false});
                    }
                    /*
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1});
                    */
                    me.game.add(shot, this.z);
                    me.game.sort();
                    // Play animation?
                }
                else if(me.input.isKeyPressed('melee')) {
                    coolDown = 8;
                    //console.log("MELEE");
                    // Play melee animation
                    // Test melee
                }
                else if(me.input.isKeyPressed('shootup')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_up', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'up'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootleft')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_left', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'left'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootdown')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_down', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'down'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else if(me.input.isKeyPressed('shootright')) {
                    coolDown = 8;
                    var shot = new BulletEntity(this.pos.x, this.pos.y, { image: 'bullet_right', 
                        spritewidth: 32, spriteheight: 32, width: 1, height: 1, ijkl: true, direc: 'right'});
                    me.game.add(shot, this.z);
                    me.game.sort();
                }
                else {

                }
            } 
        }

        if(powerUpCoolDown <= 0) {
            poweredUp = false;
            powerUpCoolDown = 0;
        }
        /*
        if(powerUpCoolDown != 0) {
            powerUpCoolDown = powerUpCoolDown - 1;
        }*/

        if(coolDown != 0) {
            coolDown = coolDown - 1;
        }

        //if(Math.random() > 0.9) {
        if(Math.random() > 0.999) {
            randX = Math.floor((Math.random()*625)+80); 
            randY = Math.floor((Math.random()*350)+80); 
            spawnCoin(randX, randY, this.z);
        }

        if (me.input.isKeyPressed('spawn')) {
            spawnCoin(this.pos.x, this.pos.y, this.z);
         } 
         if (me.input.isKeyPressed('spawnEnemy')) {
            spawnEnemy(this.pos.x, this.pos.y, this.z, 'Wheelie');
         }

         // key press for spawning multiple enemies
         if (me.input.isKeyPressed('spawnMultipleEnemies')) {
            //spawn given number of enemies in N S E or W directions
            var randSpawnPoint = Math.floor((Math.random()*4)+1);
            spawnMultipleEnemies(randSpawnPoint,4,1,5);
         }

         //PULSE
         if(me.input.isKeyPressed('pulse')) {
            //pulse(this);
            pulsing = new me.Tween(this.height);
            //pulsing.onComplete(this.stopMoving.bind(this));
            pulsing.to({height: 45}, 2000);
            pulsing.start();
         }

         // inc the score for the player by 100 for stayin aliveeee
         scoreIncCount++;
         if (scoreIncCount == 100) {
            scoreIncCount = 0;
            incScore(100);
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
            if (res.obj.type == me.game.ENEMY_OBJECT || res.obj.type == me.game.LOW_ENEMY_OBJECT) {
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
                    //this.flicker(30);
                    //decHealth();
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

function checkSpawns() {
        // spawn low if needed 
        var low = $('div.low').text();
        var mid = $('div.mid').text();
        var high = $('div.high').text();

        // spawn high if needed 
        if(high != 'false') {
            if(highOn == false) {
                if(Math.random() > 0.5) { 
                    num = Math.floor((Math.random()*3)+1); 
                    spawnMultipleEnemies(1, 0, 0, num);
                }
                else {
                    num = Math.floor((Math.random()*3)+1); 
                    loc = Math.floor((Math.random()*3)+1); 
                    spawnMultipleEnemies(loc, 0, 0, num);
                }
                highOn = true;
                return;
            }
        }
        else {
            if(highOn == true) {
                highOn = false;
            }
        }

        // spawn mid if needed 
        if(mid != 'false') {
            if(midOn == false) {
                ran = Math.random();
                if(ran > 0.7) { 
                    num = Math.floor((Math.random()*3)+1); 
                    spawnMultipleEnemies(3, num, 0, 0);
                }
                else if(ran > 0.4) {
                    num = Math.floor((Math.random()*2)+1); 
                    spawnMultipleEnemies(4, num, 0, 0);
                }
                else {
                    loc = Math.floor((Math.random()*2)+1); 
                    num = Math.floor((Math.random()*2)+1); 
                    spawnMultipleEnemies(loc, num, 0, 0);
                }
                midOn = true;
                return;
            }
        }
        else {
            if(midOn == true) {
                midOn = false;
            }
        }

        if(low != 'false') {
            if(lowOn == false) {
                if(Math.random() > 0.5) { 
                    //num = Math.floor((Math.random()*2)+1); 
                    spawnMultipleEnemies(2, 0, 1, 0);
                }
                else {
                    //num = Math.floor((Math.random()*2)+1); 
                    loc = Math.floor((Math.random()*4)+1); 
                    spawnMultipleEnemies(loc, 0, 1, 0);
                }
                lowOn = true;
                return;
            }
        }
        else {
            if(lowOn == true) {
                lowOn = false;
                console.log("false");
            }
        }

    }

function pulse(object) {
    
    pulsing = new me.Tween(object.height);
    pulsing.onComplete(object.stopMoving.bind(object));
    pulsing.to({height: 45}, 2000);
    pulsing.start();
    //tween = new me.Tween(object.height).to(10, 2000)
    //tween.easing(me.Tween.Easing.Bounce.EaseOut);
    //tween.start();
    /*
    var scaleFactor = 1;
    for(var i = 0; i < 200; i++) {
        scaleFactor = scaleFactor + 0.01;
        object.resize(scaleFactor);
    }
    for(var j = 0; j < 200; j++) {
        scaleFactor = scaleFactor - 0.01;
        object.resize(scaleFactor);
    }*/
    //object.resize(1.2);
}

/*----------------
 Spawn new object
 Params: x, y = spawn location of object
         z = z-buffer depth
 ----------------*/ 
function spawnCoin(x, y, z){
    var newCoin = new CoinEntity(x, y, {image: 'powerups', spritewidth: 32, spriteheight: 32});
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

    if (type == "enemy1") {
        var newEnemy = new EnemyEntity(x, y, {image: 'enemy1', spritewidth: 32,
         spriteheight: 32, width: 1, height: 1});
              me.game.add(newEnemy, z);
              me.game.sort();
    } else if (type == "enemy2") { // LOW Enemy Entity
        var newEnemy = new LowEnemyEntity(x, y, {image: 'enemy2', spritewidth: 64,
         spriteheight: 64, width: 2, height: 2});
              me.game.add(newEnemy, z);
              me.game.sort();
    } else if (type == "enemy3") { // HIGH Enemy Entity
        var newEnemy = new HighEnemyEntity(x, y, {image: 'enemy3', spritewidth: 16,
         spriteheight: 16, width: 2, height: 2});
              me.game.add(newEnemy, z);
              me.game.sort();
    }
}

/*-----------------
spawnEnemy wrapper that spawns multiple enemies at once
Params: location = 1, 2, 3, or 4 representing N S E or W 
        numEnemieS = number to spawn
-----------------------*/
function spawnMultipleEnemies(location, numMidEnemies, numLowEnemies, numHighEnemies) {
     
     // loop to spawn Mid Enemies
    for (var i = 0; i < numMidEnemies; i++) {
        var randOffsetX = Math.floor((Math.random()*60)+1);
        var randOffsetY = Math.floor((Math.random()*60)+1);
        var randDirection = Math.floor((Math.random()*4)+1);
        var zIndex = 20;
        var spawnX = 0;
        var spawnY = 0;

        if (location == 1) {
            // north
            spawnX = 450;
            spawnY = 70;
        } else if (location == 2) {
            // south
            spawnX = 450;
            spawnY = 420;
        } else if (location == 3) {
            // east
            spawnX = 750;
            spawnY = 240;
        } else if (location == 4) {
            // west
            spawnX = 120;
            spawnY = 240;
        }

        if (randDirection == 1) {
           spawnEnemy(spawnX-randOffsetX, spawnY-randOffsetY, zIndex, 'enemy1');
        } else if (randDirection == 2) {
           spawnEnemy(spawnX-randOffsetX, spawnY+randOffsetY, zIndex, 'enemy1');
        } else if (randDirection == 3) {
           spawnEnemy(spawnX+randOffsetX, spawnY-randOffsetY, zIndex, 'enemy1');
        } else if (randDirection == 4) {
           spawnEnemy(spawnX+randOffsetX, spawnY+randOffsetY, zIndex, 'enemy1');
        } 

    }

    // loop to spawn Low Enemies
    for (var i = 0; i < numLowEnemies; i++) {
        var randOffsetX = Math.floor((Math.random()*60)+1);
        var randOffsetY = Math.floor((Math.random()*60)+1);
        var randDirection = Math.floor((Math.random()*4)+1);
        var zIndex = 20;
        var spawnX = 0;
        var spawnY = 0;

        if (location == 1) {
            // north
            spawnX = 450;
            spawnY = 70;
        } else if (location == 2) {
            // south
            spawnX = 450;
            spawnY = 420;
        } else if (location == 3) {
            // east
            spawnX = 750;
            spawnY = 240;
        } else if (location == 4) {
            // west
            spawnX = 120;
            spawnY = 240;
        }
        
        if (randDirection == 1) {
           spawnEnemy(spawnX-randOffsetX, spawnY-randOffsetY, zIndex, 'enemy2');
        } else if (randDirection == 2) {
           spawnEnemy(spawnX-randOffsetX, spawnY+randOffsetY, zIndex, 'enemy2');
        } else if (randDirection == 3) {
           spawnEnemy(spawnX+randOffsetX, spawnY-randOffsetY, zIndex, 'enemy2');
        } else if (randDirection == 4) {
           spawnEnemy(spawnX+randOffsetX, spawnY+randOffsetY, zIndex, 'enemy2');
        } 

    }

    // loop to spawn High Enemies
    for (var i = 0; i < numHighEnemies; i++) {
        var randOffsetX = Math.floor((Math.random()*60)+1);
        var randOffsetY = Math.floor((Math.random()*60)+1);
        var randDirection = Math.floor((Math.random()*4)+1);
        var zIndex = 20;
        var spawnX = 0;
        var spawnY = 0;

        if (location == 1) {
            // north
            spawnX = 450;
            spawnY = 70;
        } else if (location == 2) {
            // south
            spawnX = 450;
            spawnY = 420;
        } else if (location == 3) {
            // east
            spawnX = 750;
            spawnY = 240;
        } else if (location == 4) {
            // west
            spawnX = 120;
            spawnY = 240;
        }
        
        if (randDirection == 1) {
           spawnEnemy(spawnX-randOffsetX, spawnY-randOffsetY, zIndex, 'enemy3');
        } else if (randDirection == 2) {
           spawnEnemy(spawnX-randOffsetX, spawnY+randOffsetY, zIndex, 'enemy3');
        } else if (randDirection == 3) {
           spawnEnemy(spawnX+randOffsetX, spawnY-randOffsetY, zIndex, 'enemy3');
        } else if (randDirection == 4) {
           spawnEnemy(spawnX+randOffsetX, spawnY+randOffsetY, zIndex, 'enemy3');
        } 

    }


}

/*----------------
 a Coin entity
------------------------ */
var CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        settings.image = "powerups";
        settings.spritewidth = 32;
        settings.spriteheight = 32;
        // call the parent constructor
        this.parent(x, y, settings);

        this.type = me.game.ITEM;
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    // check for collision
    /*
     update: function () {
        var res = me.game.collide(this);
        if (res) {
            if (res.obj.type == me.game.PLAYER) {
                // make sure it cannot be collected "again"
                this.collidable = false;
                // remove it
                me.game.remove(this);
                poweredUp = true;
            }
        }
    }*/
        
    onCollision: function(res, obj) {
        if(obj.type == me.game.PLAYER) {
            me.audio.play("power_up");
        // make sure it cannot be collected "again"
        this.collidable = false;
        // remove it
        me.game.remove(this);
        incScore(1000);
        poweredUp = true;
        }
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
        if(settings.ijkl == false) {
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
        }
        // adjust the bounding box according to the bullet direction
        else if(playerD == 'n' || playerD == 's') {
            if(settings.direc == 'up') {
                this.vel.y = -8;
            }
            else if(settings.direc == 'down') {
                this.vel.y = 8;
            }
            else if(settings.direc == 'left') {
                this.vel.x = -8;
            }
            else {
                this.vel.x = 8;
            }
            this.updateColRect(8, 16, -1, 0);
        }
        else {
            if(settings.direc == 'up') {
                this.vel.y = -8;
            }
            else if(settings.direc == 'down') {
                this.vel.y = 8;
            }
            else if(settings.direc == 'left') {
                this.vel.x = -8;
            }
            else {
                this.vel.x = 8;
            }
            this.updateColRect(-1, 0, 8, 16);
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
            if (res.obj.type == me.game.PLAYER || res.obj.type == me.game.ITEM) {

            }
            else if (res.obj.type == me.game.ENEMY_OBJECT) {
                //log points and play sound
                console.log("bullet hit mid enemy");
                
                //remove object
                me.game.remove(this);
                me.game.remove(res.obj);
            } else if (res.obj.type === me.game.LOW_ENEMY_OBJECT) {
                console.log("bullet hit low enemy");
                me.game.remove(this);
                res.obj.health--;
                res.obj.flicker(10);
                if (res.obj.health == 0) {
                    me.game.remove(res.obj);
                }
            } if (res.obj.type === me.game.HIGH_ENEMY_OBJECT) {
                console.log("bullet hit high enemy");
                //remove object
                me.game.remove(this);
                me.game.remove(res.obj);
            } 

            
            //else if (collision.x == 0 || collision.y == 0) {
            /*
            else if(res.y != 0 || res.x != 0) {
                me.game.remove(this);
            }*/
            /*
            else if (res.obj.type == me.game.PLAYER || res.obj.type == me.game.ITEM) {

            }*/
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
mid Enemy Entity
------------------------ */
var EnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "enemy1";
        settings.spritewidth = 32;
 
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
        if (obj.type == me.game.PLAYER) {
            obj.flicker(30);
            decHealth();
        }
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        /*
        if (this.alive) {

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

/* --------------------------
Low Enemy Entity (higher difficulty) 
------------------------ */

var LowEnemyEntity = me.ObjectEntity.extend({

    health: 4,

    init: function(x, y, settings) {
        // define this here instead of tiled
        //
        //  CHANGE ENEMY IMAGE AND SIZE LATER
        //
        settings.image = "enemy2";
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
        this.setVelocity(0.3, 0.3);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.LOW_ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        //if main player collides with entity dec main player's health
        if (obj.type == me.game.PLAYER) {
            obj.flicker(30);
            decHealth();
        } 
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        /*
        if (this.alive) {

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

/* --------------------------
High Enemy Entity (fast and small) 
------------------------ */

var HighEnemyEntity = me.ObjectEntity.extend({

    init: function(x, y, settings) {
        // define this here instead of tiled
        //
        //  CHANGE ENEMY IMAGE AND SIZE LATER
        //
        settings.image = "enemy3";
        settings.spritewidth = 16;
 
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
        this.setVelocity(0.9, 0.9);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.HIGH_ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
        //if main player collides with entity dec main player's health
        if (obj.type == me.game.PLAYER) {
            obj.flicker(30);
            decHealth();
        }

        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        /*
        if (this.alive) {

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







