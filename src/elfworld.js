const Matter = require('matter-js');
const Ragdoll = require('./ragdoll');
const Snowflake = require('./snowflake');

const {
  Engine,
  Body,
  Render,
  World,
  Bodies,
  Mouse,
  MouseConstraint,
  Events,
  Common,
  Composite,
} = Matter;

class ElfWorld {
  constructor(maxSnowflakes) {
    this.snowflakes = [];
    this.ragdoll = null;
    this.maxSnowflakes = maxSnowflakes || 500;

    this.createEngine();
    this.createRender();
  }

  createEngine() {
    this.engine = Engine.create();
  }

  createRender() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { engine } = this;
    this.render = Render.create({
      element: document.body,
      engine,
      options: {
        wireframes: false,
        background: 'transparent',
        width,
        height,
      },
    });
  }

  loadMouse() {
    const mouse = Mouse.create(this.render.canvas);

    const options = {
      mouse,
      constraint: {
        stiffness: 0.6,
        length: 0,
        angularStiffness: 0,
        render: {
          visible: false,
        },
      },
    };

    this.mouseConstraint = MouseConstraint.create(this.engine, options);
    World.add(this.engine.world, this.mouseConstraint);
    this.render.mouse = mouse;
  }

  loadBodies() {
    const canvasHeight = this.render.canvas.height;
    const canvasWidth = this.render.canvas.width;

    const ground = Bodies.rectangle(canvasWidth / 2, canvasHeight - 60, canvasWidth, 200, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(-100, canvasHeight / 2, 200, canvasHeight, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(canvasWidth + 100, canvasHeight / 2, 200, canvasHeight, { isStatic: true, render: { visible: false } });
    const ceiling = Bodies.rectangle(canvasWidth / 2, 10 - 100, canvasWidth, 200, { isStatic: true, render: { visible: false } });
    this.ragdoll = Ragdoll(canvasWidth / 2, canvasHeight - 350, 1, { frictionAir: 0 });

    World.add(this.engine.world, [ground, leftWall, rightWall, ceiling, this.ragdoll]);
  }

  loadEvents() {
    this.isDragging = false;

    Events.on(this.mouseConstraint, 'mouseup', () => {
      if (this.isDragging === false) {
        if (this.snowflakes.length < this.maxSnowflakes) {
          for (let i = 0; i < 10; i += 1) {
            const random = Math.random();
            const x = (random * 1000) % this.render.canvas.width;
            const y = ((random * 1000) % 100) + 10;
            const snowFlake = Snowflake(x, y, 2);
            this.snowflakes.push(snowFlake);
            World.add(this.engine.world, snowFlake);
          }
        }
      } else {
        this.isDragging = false;
      }
    });

    Events.on(this.mouseConstraint, 'startdrag', () => {
      this.isDragging = true;
    });
  }

  updateGravity(event) {
    const { orientation } = window;
    const { gravity } = this.engine.world;

    if (orientation === 0) {
      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
      gravity.y = Common.clamp(event.beta, -90, 90) / 90;
    } else if (orientation === 180) {
      gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
      gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
    } else if (orientation === 90) {
      gravity.x = Common.clamp(event.beta, -90, 90) / 90;
      gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
    } else if (orientation === -90) {
      gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
      gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
    }
  }

  removeSnowflake() {
    const size = this.snowflakes.length < 10 ? this.snowflakes.length : 10;
    for (let i = 0; i < size; i += 1) {
      const snowFlake = this.snowflakes.shift();
      Composite.remove(this.engine.world, snowFlake);
    }
  }

  randomImpulse() {
    const size = this.snowflakes.length;
    for (let i = 0; i < size; i += 1) {
      const xRandom = Math.random();
      const yRandom = Math.random();
      const snowFlake = this.snowflakes[i];
      Body.applyForce(snowFlake, { x: snowFlake.x, y: snowFlake.y }, { x: (xRandom - 0.1) % 0.001, y: (-1 * yRandom * 0.1) });
    }
    const xRandom = Math.random();
    const yRandom = Math.random();
    Body.applyForce(this.ragdoll, { x: this.ragdoll.x, y: this.ragdoll.y }, { x: 0, y: -5 });
  }

  init() {
    this.loadBodies();
    this.loadMouse();
    this.loadEvents();

    Engine.run(this.engine);
    Render.run(this.render);

    setInterval(this.removeSnowflake.bind(this), 10000);
  }
}

module.exports = ElfWorld;
