let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

let app = new Application({
        width: 400,
        height: 800,
        antialias: true,
        transparent: false,
        resolution: 1,
        backgroundColor: 0xefefef,
    }
);

document.body.appendChild(app.view);

loader
    .add([
        "images/car.png",
        "images/carEnemy.png",
        "images/way.png",
    ])
    .load(setup);

let car, carEnemy, carEnemy2, background, background2;

function setup() {
    background = new PIXI.extras.TilingSprite(resources["images/way.png"].texture, app.screen.width, app.screen.height +1);
    background2 = new PIXI.extras.TilingSprite(resources["images/way.png"].texture, app.screen.width, app.screen.height +1);

    background.vy = 3;
    background2.vy = 3;

    background.y = 0;
    background2.y = -app.screen.height;

    car = new Sprite(resources["images/car.png"].texture);

    car.x = 140;
    car.y = app.screen.height - 80;

    car.anchor.x = 0.5;

    car.vx = 0;
    car.vy = 0;

    carEnemy = generateCar();

    app.stage.addChild(background);
    app.stage.addChild(background2);
    app.stage.addChild(car);
    app.stage.addChild(carEnemy);


    let left = keyboard("ArrowLeft"),
        up = keyboard("ArrowUp"),
        right = keyboard("ArrowRight"),
        down = keyboard("ArrowDown");
    left.press = () => car.vx = -5;

    left.release = () => car.vx = 0;
    up.press = () => car.vy = -5;

    up.release = () => car.vy = 0;
    right.press = () => car.vx = 5;

    right.release = () => car.vx = 0;
    down.press = () => car.vy = 5;

    down.release = () => car.vy = 0;


    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(){
    const maxLeft = 15;
    const maxRight = app.screen.width - 15;
    const maxUp = 0;
    const maxDown = app.screen.height - 60;

    if (background.y >= app.screen.height) background.y = -app.screen.height;
    if (background2.y >= app.screen.height) background2.y = -app.screen.height;


    if (car.x + car.vx > maxLeft && car.x + car.vx < maxRight) {
        car.x += car.vx;
    }

    if (car.y + car.vy > maxUp && car.y + car.vy < maxDown) {
        car.y += car.vy;
    }

    carEnemy.y += carEnemy.vy;

    background.y += background.vy;
    background2.y += background2.vy;
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };


    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener);
    window.addEventListener("keyup", upListener);

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

function generateCar() {
    const index = Math.floor(Math.random() * 2);

    const newCar = new Sprite(resources["images/carEnemy.png"].texture);

    newCar.x = index ? 230 : 120;
    newCar.y = -80;
    newCar.vy = 2;

    return newCar;
}