const userData = require("./routes/events");
var mongoose = require('mongoose');
// var ObjectId = mongoose.Schema.Types.ObjectId;

async function main() {

  
  mongoose.connect('mongodb://localhost:27017/tutoringwebsite', {useNewUrlParser: true});
  const id="5cd495a8ba45e7dd984de5fa";
  const result=await userData.getByTutor(id);
  console.log(result);

 
  const result2=await userData.getById(id);
  console.log(result2);

}

main()