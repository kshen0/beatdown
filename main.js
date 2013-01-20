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
    name: "powerups",
    type: "image",
    src: "data/sprite/powerups.png"
},
// our enemty entity
{
    name: "enemy1",
    type: "image",
    src: "data/sprite/enemy1.png"
},
// bullet entity
{
	name: "bullet_right",
	type: "image",
	src: "data/sprite/bullet_right.png"
},
// bullet entity
{
	name: "bullet_left",
	type: "image",
	src: "data/sprite/bullet_left.png"
},
// bullet entity
{
	name: "bullet_up",
	type: "image",
	src: "data/sprite/bullet_up.png"
},
// bullet entity
{
	name: "bullet_down",
	type: "image",
	src: "data/sprite/bullet_down.png"
},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/sprite/bebas_font.png"
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
        //if (!me.video.init('jsapp', 640, 480, false, 1.0)) {
        if (!me.video.init('jsapp', 850, 550, false, 1.0)) {
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
   me.input.bindKey(me.input.KEY.R, "spawnMultipleEnemies", true);
   // Combat keys
   me.input.bindKey(me.input.KEY.P, "shoot");
   me.input.bindKey(me.input.KEY.O, "melee");
   me.input.bindKey(me.input.KEY.I, "shootup");
   me.input.bindKey(me.input.KEY.J, "shootleft");
   me.input.bindKey(me.input.KEY.K, "shootdown");
   me.input.bindKey(me.input.KEY.L, "shootright");
   //me.input.bindKey(me.input.KEY.X,     "jump", true);

   //CHEATS
   //me.input.bindKey(me.input.KEY.I,  "i");
   me.input.bindKey(me.input.KEY.U,  "u");
      
   // start the game
   me.state.change(me.state.PLAY);

   //me.game.onLevelLoaded = onTimerTick;

   // start the game
   me.state.change(me.state.MENU);

   //me.debug.renderHitBox = true;
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
        me.game.HUD.updateItemValue("health", 5);

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

/*----------------------------------------

Functions and js junk

-------------------------------------------*/

// increment score
// keep in mind, if collecting an item and updating HUD, need to
// set this.collidable = false (for hte object you're collecting)
// and also me.game.remove(this)
function incScore(numPoints) {
    me.game.HUD.updateItemValue("score", numPoints);
}

function decHealth() {
  if (!isFlickering) {
    me.game.HUD.updateItemValue("health", -1);
    isFlickering = true;
    window.setTimeout(function() {isFlickering = false}, 3000);

  } 
}
 
//bootstrap :)
window.onReady(function() {
    jsApp.onload();
});
