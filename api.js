const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose')
const csv = require('csv-parser')
const fs = require('fs');
// passport.use(new BasicStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.validPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));
let fileName = '';
const results = [];
const storage = multer.diskStorage({
    destination:function(req,file,res){
     res(null,__dirname+'/public/upload')
    },
    filename:function(req,file,res){
      fileName=file.originalname;
      res(null,fileName)
    }
})
const fileFilter =(req,file,cb)=>{
    if(file.mimetype==='text/csv'){
        cb(null,true)
    }else{
        cb(new Error('file type is not supported'),false)
    }
}
const upload=multer({storage:storage,fileFilter:fileFilter,limits:{fileSize:1024*1024*6}})

const app = express();
app.use(express.static('public'));
mongoose.connect(
'mongodb://localhost:27017/csvDB'
, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
// mongoose.connect(
//     'mongodb://localhost:27017/userDB'
//     , {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useUnifiedTopology: true
//     });
const fileSchema = {
  SerialNumber:String,
  CompanyName:String,
  EmployeeMarkme:String,
  Description:String,
  Leave:String

}


const File = mongoose.model('File',fileSchema)

app.post('/',upload.single('image'), (req, res) => {
fs.createReadStream(__dirname+'/public/upload'+'/' + fileName)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    results.forEach(function(item){ 
      const newFile = new File({
        SerialNumber:item.Serial_Number,
        CompanyName:item.Company_Name,
        EmployeeMarkme:item.Employee_Markme,
        Description:item.Description,
        Leave:item.Leave
       
      })
      newFile.save()
    })
      res.send('done')
   });
});


app.listen(3000, () => {
    console.log(`Server started on port`);
})