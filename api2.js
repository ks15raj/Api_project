const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended:true}))
mongoose.connect(
'mongodb://localhost:27017/csvDB'
    , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const fileSchema = {
    SerialNumber:String,
    CompanyName:String,
    EmployeeMarkme:String,
    Description:String,
    Leave:String
  
  }
  
  
  const File = mongoose.model('File',fileSchema)
  app.post('/csv', (req, res) => {
    const newFile = new File({
        SerialNumber:item.Serial_Number,
        CompanyName:item.Company_Name,
        EmployeeMarkme:item.Employee_Markme,
        Description:item.Description,
        Leave:item.Leave
       
      })
      newFile.save(function(err){
          if(!err){
              res.send('New Data has been added')
          }else{
              res.send('There is an error')
          }
      })
  });
app.route('/csv/:serial')
    .get((req,res)=>{
    const data = req.params.serial
    if(data==='all'){
        File.find({},function(err,result){
            if(!err){
                res.send(result)
            } else{
                res.send(err)
            }
        })
    }else{
        
        File.findOne({SerialNumber:data},function(err,result){
            if(!err){
                res.send(result)
            } else{
                res.send(err)
            }
        })

    }
         
    })
    .put(function(req,res){
        const data = req.params.serial;
        console.log(req.body)
        File.update(
            {SerialNumber:data},
            req.body,
            {overwrite:1},
            function(err){
                if(!err){
                    res.send('Done')
                }

            }
            
            )
    })
    .patch(function(req,res){
        const data = req.params.serial;
        File.update(
            {SerialNumber:data},
            {$set:req.body},
            function(err) {
                res.send('Patched Entry with SerialNo. '+data)
            }
        )
    })
    .delete(function(req,res){
        const data = req.params.serial
        if(data==='all'){
            File.remove({}, function(err) { 
                res.send('Collection Removed') 
             });
        }else{
            File.deleteOne(
                {SerialNumber:data},
                function(err) {
                    if(!err){
                        res.send('Removed Entry with SerialNo. '+data)
                    }
                })
            
    
        }
})

app.listen(3000, () => {
    console.log(`Server started on port`);
});