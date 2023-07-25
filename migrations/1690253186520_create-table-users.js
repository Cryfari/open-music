/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('users', 'unique_username', 'UNIQUE(username)');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
