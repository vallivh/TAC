import Phaser from 'phaser'

export default class Card extends Phaser.GameObjects.Sprite {

    constructor (scene, x, y, key)
    {
        super(scene, x, y, key);

        this.setTexture("cards");
        this.setFrame("back").setName(key);
        this.setPosition(x, y);
        this.setScale(0.45);
        this.setInteractive();
        this.scene = scene;
        scene.input.setDraggable(this);

        this.dropped = false;
    }
}

Phaser.GameObjects.GameObjectFactory.register('card', function (x, y, key)
{
    const card = new Card(this.scene, x, y, key);

    this.displayList.add(card);
    this.updateList.add(card);

    return card;
});