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
let highsquare;
let monster;
let cursors;
let playerHealth;
let enemyHealth;
let q;
let w;
let e;
let r;

function preload ()
{
    this.load.image('player', './player.png');
    this.load.image('monster', './monster.png');
    this.load.image('hitsquare', './hitsquare.png');
    this.load.image('bullet', './bullet.png');
    this.load.image('q', './q.png');
    this.load.image('w', './w.png');
    this.load.image('e', './e.png');
    this.load.image('r', './r.png');
    this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.load.audio('seven', './SNA.mp3');
}

let notes = [];
let counter = 0;
let specCounter = true;
let barCounter = -1;
function makeNotesFall (game)
{
    setInterval(() => {
        let noteslen = notes.length;
        if(barCounter < 11 || barCounter > 16) {
            if(counter == 0)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));
            
            if(counter == 6)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));

            if(counter == 8)
                notes.push(game.physics.add.sprite(96 + 16, 0, 'r'));

            if(counter == 11)
                notes.push(game.physics.add.sprite(64 + 16, 0, 'e'));

            if(counter == 14)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));

            if(counter == 16)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));

            if(counter == 24)
                notes.push(game.physics.add.sprite(0 + 16, 0, 'q'));

        } else if(barCounter == 11 || barCounter == 16){
            if(counter % 2 == 0 && counter < 16) {
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));
            } else if(counter % 2 == 0) {
                notes.push(game.physics.add.sprite(64 + 16, 0, 'e'));
            }
        } else {
            
            if(counter == 0)
                specCounter = !specCounter;

            if(counter == 0)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));
        
            if(counter == 6)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));

            if(counter == 8)
                notes.push(game.physics.add.sprite(96 + 16, 0, 'r'));

            if(counter == 11)
                notes.push(game.physics.add.sprite(64 + 16, 0, 'e'));

            if(counter == 14)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));

            if(counter == 16)
                notes.push(game.physics.add.sprite(32 + 16, 0, 'w'));

            if(counter == 19 && specCounter)
                notes.push(game.physics.add.sprite(96 + 16, 0, 'r'));

            if(counter == 22 && specCounter)
                notes.push(game.physics.add.sprite(64 + 16, 0, 'e'));

            if(counter == 24) {
                notes.push(game.physics.add.sprite(0 + 16, 0, 'q'));
            }
        }

        if(noteslen != notes.length) {
            game.physics.add.collider(notes[notes.length - 1]);
        }

        counter = (counter + 1) % 32;
        if(counter == 0) barCounter++;
        //console.log(barCounter);
    } , 122);
    
    setTimeout(() => game.sound.play('seven'), 4600);
}

function create ()
{
    monster = this.physics.add.sprite(400, 300, 'monster');
    monster.scale = 3;
    player = this.physics.add.sprite(400, 500, 'player');
    player.scale = 3;
    hitsquare = this.physics.add.sprite(2000, 600 - 32, 'hitsquare');
    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, monster);
    this.physics.collide(player, monster);
    
    this.physics.add.collider(player, monster);

    playerHealth = this.add.text(10, 10, "100");
    enemyHealth = this.add.text(750, 10, "150");

    q = this.input.keyboard.addKey('Q');
    w = this.input.keyboard.addKey('W');
    e = this.input.keyboard.addKey('E');
    r = this.input.keyboard.addKey('R');

    monster.body.immovable = true;
    makeNotesFall(this);
}

function destroyBullet(bullet) {
    const index = bullets.indexOf(bullet);
    bullets.splice(index, 1);
    bullet.destroy();
}

function playerDmg(player, bullet) {
    destroyBullet(bullet);
    playerHealth.text = "" + parseInt(playerHealth.text - 20);

    if(playerHealth.text === "0")
        player.destroy();
}

function playNote(hitsquare, note) {
    const index = notes.indexOf(note);
    notes.splice(index, 1);
    note.destroy();

    enemyHealth.text = "" + parseInt(enemyHealth.text - 1);

    if(enemyHealth.text === "0")
        monster.destroy();
}

let bullets = [];
let cooldown = 1;
function update (timestamp, deltaTime)
{
    deltaTime /= 1000;
    timestamp /= 1000;
    getInput();

    cooldown -= deltaTime;

    if(cooldown < 0)
    {
        cooldown = 2;
        for(let i = 0; i < 8; i++) {
            const bullet = this.physics.add.sprite(400, 300, 'bullet');
            bullet.scale = 3;
            this.physics.add.collider(bullet);
            const dir = new Phaser.Math.Vector2();
            dir.setToPolar(timestamp / (2 * PI) + (2*PI/8)*i, 50);
            bullet.setVelocityX(dir.x);
            bullet.setVelocityY(dir.y);
            bullets.push(bullet);

            setTimeout(() => {
                destroyBullet(bullet);
            }, 10000);
        }
    }

    bullets.map(bullet => {
        this.physics.collide(player, bullet, playerDmg, null, this);
    });

    this.children.bringToTop(hitsquare);

    if(q.isDown) {
        hitsquare.x = 0 + 16;
    } else if(w.isDown) {
        hitsquare.x = 32 + 16;
    } else if(e.isDown) {
        hitsquare.x = 64 + 16;
    } else if(r.isDown) {
        hitsquare.x = 96 + 16;
    } else {
        hitsquare.x = 2000;
    }

    notes.map(note => {
        note.body.y+=deltaTime * 100;
        this.physics.collide(hitsquare, note, playNote, null, this);
    });

}