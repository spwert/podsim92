var MYAPP = MYAPP || {};

MYAPP.updateDolphin = function () {
    // handle incoming commands
    for (var i = 0; i < this.commandQueue.length; i++) {
        this.commandQueue[i].execute(this);
    }
    this.commandQueue = [];
};

// turns a sprite into a dolphin
MYAPP.dolphinifySprite = function (sprite) {
    // set rotation point
    sprite.anchor.set(0.5);
    // sprite is backwards! shit!
    sprite.scale.x *= -1;
    // setup physics
    MYAPP.game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.totalDrag = MYAPP.DOLF_DRAG;
    sprite.body.maxVelocity.set(MYAPP.DOLF_MAX_VEL);
    // add game loop functions
    sprite.update = MYAPP.updateDolphin;
    // limit sprite to world bounds
    sprite.body.collideWorldBounds = true;
    // add command queue
    sprite.commandQueue = [];
};
