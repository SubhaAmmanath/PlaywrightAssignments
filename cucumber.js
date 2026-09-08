module.exports = {
  default: {
    paths: ['Tests/features/**/*.feature'],
    require: [
      'Tests/features/support/**/*.js',
      'Tests/features/step_definition/**/*.js'
    ],
    format: ['progress']
  }
};