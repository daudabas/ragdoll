const Matter = require('matter-js');


const snowflake = (x, y, airFriction, options) => {
  const {
    Body,
    Bodies,
    Common,
  } = Matter;

  const snowflakeOptions = Common.extend({
    label: 'snowflake',
    frictionAir: airFriction,
    density: 0.001,
    collisionFilter: {
      group: Body.nextGroup(true),
    },
    render: {
      fillStyle: '#FFFFFF',
    },
  }, options);

  const snow = Bodies.circle(x, y, 10, snowflakeOptions);
  return snow;
};

module.exports = snowflake;
