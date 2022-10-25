//jshint everision: 6


//from line 4 to line 14 keep a copy because u have to use it everywhere
const express = require('express')
const request = require('request')
var bodyParser = require('body-parser')
const https = require("https")


const app = express();

app.use(express.static('public'))  // to connect to the local files here it is style.css
app.use(bodyParser.urlencoded({ extended: true }))


// ----------------------------------------------------------------------------------------------------



app.get('/', (req, res) => 
  {
     res.sendFile(__dirname + '/signup.html')
   
    
    
})


app.post('/',function(req, res){
    
  // logging variables
  var firstName = req.body.fname   // fname is from input name="fname"(signup.html)
  var lastName = req.body.lname   // lname is from input name="lname"
  var email = req.body.email   // email is from input name="email"

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{                               //  data we are sending to the server
          FNAME: firstName,                          //  in its own way
          LNAME: lastName
        }
      }
    ]
  };

  var jsondata = JSON.stringify(data)

  //----------------------------------------------------------
  //     data we are getting from the server

  const url = "https://us21.api.mailchimp.com/3.0/lists/5cae79df3d"

  const options = {
    method: "POST",
    auth : "sriman:5a4e886f6ed385a6bce145ca1bb086c9-us21"

  }

  const request = https.request(url, options, function(response){    // why https.request and not get ?  -> send data and getting back we use 
    
    
    if (response.statusCode === 200){
      
      res.sendFile(__dirname + "/success.html");

    }else{
      res.sendFile(__dirname + "/failure.html");


    }
    
    response.on("data",function(data){                                                                   // https.request , while we only need      
      console.log(JSON.parse(data))                                                                       // data we use https.get
    })
  })

  request.write(jsondata)
  request.end();


});

app.post('/failure',function(req, res){
  res.redirect('/')                         // redirecting to the above line codes which is the home route 
})





app.listen(process.env.PORT || 3000,()=>{
    console.log("running on port 3000")
})



// API key -   5a4e886f6ed385a6bce145ca1bb086c9-us21
// audience id / list id = 5cae79df3d