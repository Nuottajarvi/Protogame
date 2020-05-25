const speed = 200;
const PI = 3.14159;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true
};

const game = new Phaser.Game(config);
let player;
let monster;
let cursors;

function preload ()
{
    this.load.image('player', './player.png');
    this.load.image('monster', './monster.png');
    this.load.image('bullet', './bullet.png');
    this.load.image('healthbar', './healthbar.png');
}

function create ()
{
    monster = this.physics.add.sprite(400, 300, 'monster');
    monster.scale = 3;
    player = this.physics.add.sprite(400, 500, 'player');
    player.scale = 3;
    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, monster);
    this.physics.collide(player, monster);

    monster.body.immovable = true;
}

let cooldown = 1;
function update (timestamp, deltaTime)
{
    deltaTime /= 1000;
    timestamp /= 1000;
    getInput();

    cooldown -= deltaTime;

    if(cooldown < 0)
    {
        cooldown = 1;
        for(let i = 0; i < 8; i++) {
            const bullet = this.physics.add.sprite(400, 300, 'bullet');
            bullet.scale = 3;
            this.physics.add.collider(bullet);
            const dir = new Phaser.Math.Vector2();
            dir.setToPolar(timestamp / (2 * PI) + (2*PI/8)*i, 500);
            bullet.setVelocityX(dir.x);
            bullet.setVelocityY(dir.y);

            setTimeout(() => bullet.destroy(), 1000);
        }
    }
}