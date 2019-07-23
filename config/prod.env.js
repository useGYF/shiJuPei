// module.exports = {
//   NODE_ENV: '"production"',
//   API_ROOT:'"PROD"'
// }
var producationType = process.argv.slice(2)[0];
var obj = {
  NODE_ENV: '"production"',
};
switch(producationType){
  case 'test':
    process.env.API_ROOT = 'TEST';
    obj.API_ROOT = '"TEST"';
    break;
  default:
    process.env.API_ROOT = 'PROD';
    obj.API_ROOT = '"PROD"';
    break;
}
module.exports = obj;
