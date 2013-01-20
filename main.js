// game resources
var g_resources = [
// our level tileset
{
    name: "area01_level_tiles",
    type: "image",
    src: "data/area01_tileset/area01_level_tiles.png"
},
// our level
{
    name: "area01",
    type: "tmx",
    src: "data/area01.tmx"
},
// the main player spritesheet
{
    name: "hero",
    type: "image",
    src: "data/sprite/hero.png"
},
// the parallax background
{
    name: "area01_bkg0",
    type: "image",
    src: "data/area01_parallax/area01_bkg0.png"
}, {
    name: "area01_bkg1",
    type: "image",
    src: "data/area01_parallax/area01_bkg1.png"
},
// the spinning coin spritesheet
{
    name: "spinning_coin_gold",
    type: "image",
    src: "data/sprite/spinning_coin_gold.png"
},
// our enemty entity
{
    name: "wheelie_right",
    type: "image",
    src: "data/sprite/wheelie_right.png"
},
// bullet entity
{
	name: "bullet_right",
	type: "image",
	src: "data/sprite/bullet.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/sprite/32x32_font.png"
},

// title screen
{
    name: "title_screen",
    type: "image",
    src: "data/GUI/title_screen.png"

},
//cling audio
{
    name: "cling",
    type: "audio",
    src: "data/audio/",
    channel: 2
},
//BUY1
{
    name: "BUY1",
    type: "audio",
    src: "data/audio/",
    //channel: 2
}];
 
var jsApp = {
    /* ---
 
     Initialize the jsApp
 
     --- */
    onload: function() {
 
        // init the video
        if (!me.video.init('jsapp', 640, 480, false, 1.0)) {
            alert("Sorry but your browser does not support html 5 canvas.");
            return;
        }
 
        // initialize the "audio"
        me.audio.init("mp3,ogg");
 
        // set all resources to be loaded
        me.loader.onload = this.loaded.bind(this);
 
        // set all resources to be loaded
        me.loader.preload(g_resources);
 
        // load everything & display a loading screen
        me.state.change(me.state.LOADING);
    },
 
    /* ---
 
     callback when everything is loaded
 
     --- */

    loaded: function ()
{
   // set the "Play/Ingame" Screen Object
   me.state.set(me.state.MENU, new TitleScreen());
   me.state.set(me.state.PLAY, new PlayScreen());

   //transition
   me.state.transition("fade", "#FFFFFF", 250);
     
   // add our player entity in the entity pool
   me.entityPool.add("mainPlayer", PlayerEntity);
   me.entityPool.add("CoinEntity", CoinEntity);
   me.entityPool.add("EnemyEntity", EnemyEntity);
   //me.entityPool.add("BulletEntity", BulletEntity);
             
   // enable the keyboard
   me.input.bindKey(me.input.KEY.A,  "left");
   me.input.bindKey(me.input.KEY.D, "right");
   me.input.bindKey(me.input.KEY.W,    "up");
   me.input.bindKey(me.input.KEY.S,  "down");
   // Spawn keys
   me.input.bindKey(me.input.KEY.Q, "spawn", true);
   me.input.bindKey(me.input.KEY.E, "spawnEnemy", true);
   // Combat keys
   me.input.bindKey(me.input.KEY.P, "shoot");
   me.input.bindKey(me.input.KEY.O, "melee");
   //me.input.bindKey(me.input.KEY.X,     "jump", true);

   //CHEATS
   me.input.bindKey(me.input.KEY.I,  "i");
   me.input.bindKey(me.input.KEY.U,  "u");
      
   // start the game
   me.state.change(me.state.PLAY);

   //me.game.onLevelLoaded = onTimerTick;

   // start the game
   me.state.change(me.state.MENU);
}
 
};
// jsApp
/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend({
 
    onResetEvent: function() {
        // stuff to reset on state change
        // load a level
        me.levelDirector.loadLevel("area01");
 
 	// add a default to the game mngr
        me.game.addHUD(0, 430, 640, 60);
        // add a new HUD item
        me.game.HUD.addItem("score", new ScoreObject(620, 10));

        // add a health HUD item
        me.game.HUD.addItem("health", new HealthObject(300,10));

        //make sure things in right order
        me.game.sort();

        //me.audio.play("BUY1");
    },

    /* ---
 
    action to perform when game is finished (state change)
 
    --- */
    onDestroyEvent: function() {
    	//remove the HUD
    	me.game.disableHUD();
}
 
});
/*
//MAIN GAME LOOP
setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec

function onTimerTick() {
    if (me.input.isKeyPressed('spawn')) {
    	//me.entityPool.add("CoinEntity2", CoinEntity);
    	//me.state.change(me.state.PAUSE); 
    	  var newEnemy = new CoinEntity(2, 2, {image: 'spinning_coin_gold', spritewidth: 32, spriteheight: 32});
    	  me.game.add(newEnemy, this.z);
    	  //me.game.add(new EnemyEntity(5, 5,{}), 3);
    	  me.game.sort();
    	  console.log("fuck yea");
    } 
}*/

/*----------------------------------------

Functions and js junk

-------------------------------------------*/

// increment score
// keep in mind, if collecting an item and updating HUD, need to
// set this.collidable = false (for hte object you're collecting)
// and also me.game.remove(this)
function incScore() {
    me.game.HUD.updateItemValue("score", 1000);
}

function decHealth() {
    me.game.HUD.updateItemValue("health", -100);
}
/*
//MAIN GAME LOOP
setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec

function onTimerTick() {
    if (true) {
        // maybe check to see what type of thing to spawn based on intensity
        //set bool to false and repeat
    }

    if (me.input.isKeyPressed('i')) {
        incScore();
    }

     if (me.input.isKeyPressed('u')) {
        decHealth();
    }

    if (me.input.isKeyPressed('left')) {

    	  me.game.add(new EnemyEntity(5, 5,{}), 10);
          
    } 
}

var songList = new Array();
songList[0] = "cling";
songList[1] = "BUY1";
songNum = 0;
setInterval(switchSong, 2000);
function switchSong() {
    if (songNum == 0) {
        me.audio.play(songList[0]);
        songNum++;
    } else if (songNum == 1) {
        me.audio.play(songList[1]);
        songNum--;
    }
} */

 
//bootstrap :)
window.onReady(function() {
    jsApp.onload();
});