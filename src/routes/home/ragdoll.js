const Matter = require('matter-js');

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {  return images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

const ragdoll = (headURL, x, y, sc, options) => {
  const scale = typeof sc === 'undefined' ? 1 : sc;

  const headImage = headURL || images['head@2x.png'];

  const {
    Body,
    Bodies,
    Constraint,
    Composite,
    Common,
  } = Matter;

  const headOptions = Common.extend({
    label: 'head',
    mass: 0.1,
    collisionFilter: {
      group: Body.nextGroup(false),
    },
    chamfer: {
      radius: [75 * scale, 75 * scale, 75 * scale, 75 * scale],
    },
    render: {
      sprite: {
        texture: headImage,
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  }, options);

  const chestOptions = Common.extend({
    label: 'chest',
    mass: 1,
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      sprite: {
        texture: images['body@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  }, options);

  const leftArmOptions = Common.extend({
    label: 'left-arm',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    chamfer: {
      radius: 10 * scale,
    },
    render: {
      sprite: {
        texture: images['left_upper_arm@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  }, options);

  const leftLowerArmOptions = Common.extend({
    mass: 10,
    chamfer: {
      radius: 10 * scale,
    },
  }, leftArmOptions, {
    render: {
      sprite: {
        texture: images['left_forearm@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  });

  const rightArmOptions = Common.extend({
    label: 'right-arm',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    chamfer: {
      radius: 10 * scale,
    },
    render: {
      sprite: {
        texture: images['right_upper_arm@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  }, options);

  const rightLowerArmOptions = Common.extend({
    mass: 10,
    chamfer: {
      radius: 10 * scale,
    },
  }, rightArmOptions, {
    render: {
      sprite: {
        texture: images['right_forearm@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  });

  const leftLegOptions = Common.extend({
    label: 'left-leg',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      sprite: {
        texture: images['left_thigh@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  }, options);

  const leftLowerLegOptions = Common.extend({}, leftLegOptions, {
    mass: 5,
    render: {
      sprite: {
        texture: images['left_foot@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  });

  const rightLegOptions = Common.extend({
    label: 'right-leg',
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      sprite: {
        texture: images['right_thigh@2x.png'],
        xScale: 0.5,
        yScale: 0.5,
      },
    },
  }, options);

  const rightLowerLegOptions = Common.extend({}, rightLegOptions, {
    mass: 5,
    render: {
      sprite: {
        texture: images['right_foot@2x.png'],
      },
    },
  });
  const headOffset = (headURL) ? 20 : 0;
  const head = Bodies.rectangle((x - 5) * scale, (y - 130 + headOffset) * scale, 152 * scale, 163 * scale, headOptions);
  const chest = Bodies.rectangle(x * scale, y * scale, 98 * scale, 105 * scale, chestOptions);
  const rightUpperArm = Bodies.rectangle((x + 45) * scale, (y - 20) * scale, 17 * scale, 40 * scale, rightArmOptions);
  const leftUpperArm = Bodies.rectangle((x - 45) * scale, (y - 20) * scale, 17 * scale, 40 * scale, leftArmOptions);
  const rightLowerArm = Bodies.rectangle((x + 45) * scale, (y + 25) * scale, 26 * scale, 64 * scale, rightLowerArmOptions);
  const leftLowerArm = Bodies.rectangle((x - 45) * scale, (y + 25) * scale, 26 * scale, 64 * scale, leftLowerArmOptions);
  const leftUpperLeg = Bodies.rectangle((x - 22) * scale, (y + 50) * scale, 21 * scale, 32 * scale, leftLegOptions);
  const rightUpperLeg = Bodies.rectangle((x + 22) * scale, (y + 50) * scale, 21 * scale, 32 * scale, rightLegOptions);
  const leftLowerLeg = Bodies.rectangle((x - 32) * scale, (y + 90) * scale, 38 * scale, 55 * scale, leftLowerLegOptions);
  const rightLowerLeg = Bodies.rectangle((x + 32) * scale, (y + 90) * scale, 38 * scale, 55 * scale, rightLowerLegOptions);

  const headConstraint = Constraint.create({
    bodyA: head,
    pointA: {
      x: -5 * scale,
      y: (90 - headOffset) * scale,
    },
    pointB: {
      x: -10 * scale,
      y: -40 * scale,
    },
    bodyB: chest,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const headConstraint2 = Constraint.create({
    bodyA: head,
    pointA: {
      x: 15 * scale,
      y: (90 - headOffset) * scale,
    },
    pointB: {
      x: 10 * scale,
      y: -40 * scale,
    },
    bodyB: chest,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperArm = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 45 * scale,
      y: -30 * scale,
    },
    pointB: {
      x: -0 * scale,
      y: -10 * scale,
    },
    bodyB: rightUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperArm = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -45 * scale,
      y: -30 * scale,
    },
    pointB: {
      x: 0 * scale,
      y: -10 * scale,
    },
    bodyB: leftUpperArm,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightArm = Constraint.create({
    bodyA: rightUpperArm,
    bodyB: rightLowerArm,
    pointA: {
      x: 0 * scale,
      y: 20 * scale,
    },
    pointB: {
      x: 0 * scale,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftArm = Constraint.create({
    bodyA: leftUpperArm,
    bodyB: leftLowerArm,
    pointA: {
      x: -0 * scale,
      y: 20 * scale,
    },
    pointB: {
      x: -0 * scale,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperLeg = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -30 * scale,
      y: 40 * scale,
    },
    pointB: {
      x: -8 * scale,
      y: -10 * scale,
    },
    bodyB: leftUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToLeftUpperLeg2 = Constraint.create({
    bodyA: chest,
    pointA: {
      x: -14 * scale,
      y: 40 * scale,
    },
    pointB: {
      x: 8 * scale,
      y: -10 * scale,
    },
    bodyB: leftUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperLeg = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 30 * scale,
      y: 40 * scale,
    },
    pointB: {
      x: 8 * scale,
      y: -10 * scale,
    },
    bodyB: rightUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const chestToRightUpperLeg2 = Constraint.create({
    bodyA: chest,
    pointA: {
      x: 14 * scale,
      y: 40 * scale,
    },
    pointB: {
      x: -8 * scale,
      y: -10 * scale,
    },
    bodyB: rightUpperLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftLeg = Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: -6 * scale,
      y: 15 * scale,
    },
    pointB: {
      x: 4 * scale,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerLeftLeg2 = Constraint.create({
    bodyA: leftUpperLeg,
    bodyB: leftLowerLeg,
    pointA: {
      x: 6 * scale,
      y: 15 * scale,
    },
    pointB: {
      x: 16 * scale,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightLeg = Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: -6 * scale,
      y: 15 * scale,
    },
    pointB: {
      x: -16 * scale,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const upperToLowerRightLeg2 = Constraint.create({
    bodyA: rightUpperLeg,
    bodyB: rightLowerLeg,
    pointA: {
      x: 6 * scale,
      y: 15 * scale,
    },
    pointB: {
      x: -4 * scale,
      y: -25 * scale,
    },
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const legToLeg = Constraint.create({
    bodyA: leftLowerLeg,
    bodyB: rightLowerLeg,
    stiffness: 0.6,
    render: {
      visible: false,
    },
  });

  const person = Composite.create({
    bodies: [
      leftUpperLeg, rightUpperLeg, leftLowerLeg, rightLowerLeg,
      chest, rightUpperArm, leftUpperArm,
      rightLowerArm, leftLowerArm, head,
    ],
    constraints: [
      headConstraint, headConstraint2,
      chestToRightUpperArm,
      chestToLeftUpperArm, upperToLowerRightArm, upperToLowerLeftArm,
      chestToLeftUpperLeg, chestToLeftUpperLeg2,
      chestToRightUpperLeg, chestToRightUpperLeg2,
      upperToLowerRightLeg, upperToLowerRightLeg2,
      upperToLowerLeftLeg,upperToLowerLeftLeg2,
      legToLeg,
    ],
  });
  return person;
};

module.exports = ragdoll;
