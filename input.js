function getInput()
{

    if(cursors.left.isDown)
    {
        player.body.setVelocityX(-speed);
    }
    else if(cursors.right.isDown)
    {
        player.setVelocityX(speed);
    } 
    else 
    {
        player.setVelocityX(0);
    }

    if(cursors.down.isDown)
    {
        player.setVelocityY(speed);
    }
    else if(cursors.up.isDown)
    {
        player.setVelocityY(-speed);
    }
    else 
    {
        player.setVelocityY(0);
    }

}