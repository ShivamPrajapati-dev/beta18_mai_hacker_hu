const http = require('http');
const express = require('express');
const { env } = require('process');
var nodemailer = require('nodemailer');
var timeout = require('connect-timeout')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const request = require('request')
const geocode = require('./utlis/geocoding')

const reverseGeoCoding = require('./utlis/reverseGeocoding')

const app = express();
app.use(express.json()); 
  
 
app.use(express.urlencoded({ extended: true }));
var accountSid = "AC3aea6de4b73cfc164634fb96bffc18d9";
var authToken = 'b5e7f6a740ad4f5f8daa60dd8b0538af';

var twilio = require("twilio");
var client = new twilio(accountSid, authToken);





app.post('/sms',timeout('600s'), (req, res) => {

  console.log("recived");
  
  console.log(req.body)
  // var keyToIdentify = req.body.key;
  var longituteS = req.body.log;
  var latitudeS = req.body.lat;
  var destinationAddress = req.body.destination;
  var toNumber = req.body.phoneNumber;
  // console.log(destinationAddress , toNumber);
  
  // geocode(sourceAddress, (erro, { longitute : longituteS,  latitude : latitudeS } = {}) => {
  //   if (erro) {
  //     return res.send({
  //       error: 'Try another name pls!'
  //     })
  //   }
  //   else {
      geocode(destinationAddress, (erro, { longitute : longituteD, latitude : latitudeD } = {}) => {
        if (erro) {
          return res.send({
            error: 'Try another name pls!'
          })
        }
        else {

          var url = "https://router.project-osrm.org/route/v1/driving/" + longituteS + "," + latitudeS + ";" + longituteD + "," + latitudeD + "?geometries=geojson&alternatives=true&steps=true&generate_hints=false"
          console.log(url);
          request({ url: url, json: true }, (error, response = {}) => {
            if (error) {
              console.log("map error");
              req.send("404");

            }
            else {


    

              console.log(response.body);
///////////////////////////////kunal code/////////////////////////////////////////////////////////////

            // var sed_res = ""
            // data = response.body
            // // var obj = JSON.parse(data)
            // var obj = data
            // console.log(typeof(obj));
            // var y = obj.routes[0].legs[0];
            // var len = Object.keys(y['steps']).length;

            // for (var i = 0; i < len; i++) {
                
            //     console.log(sed_res)
            //     console.log(i)
                

            //     console.log(y['steps'][i].intersections[0].location[0],y['steps'][i].intersections[0].location[1]);
            //     var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+y['steps'][i].intersections[0].location[0]+","+y['steps'][i].intersections[0].location[1]+".json?access_token=pk.eyJ1IjoiYWJoaXNoZWs5OTkiLCJhIjoiY2s3Z200dDhsMDEyZTNrcWRrZHpyanlrbCJ9.VP-Hevh7jsp0apFn3Y8KDA"
            //    request({url:url,json:true},(error,resReverseGeocoding={})=>{
            //       if(error)
            //       {
            //           console.log("Rever geocoding error")
                     

            //       }else{
                       
            //         var pace_name = resReverseGeocoding.body.features[0].place_name;
            //         var text = resReverseGeocoding.body.features[0].text;

            //         sed_res += "{\n" + "Duration = " + y['steps'][i].duration + "\n" + "Distance = " + y['steps'][i].distance + "\n" + "Mode = " + y['steps'][i].mode + "\n" + "Turn = " + y['steps'][i]['maneuver'].modifier + "\n"+ "Place_name: " + place_name + "\n Text : "+ text+"\n}" + '\n'
                
            //         if(i==len-1)
            //          {
                  
            //          client.messages
            //         .create({
            //             body: sed_res,
            //             to: "+916265070160",
            //             from: "+12562517792",
            //         }).then((message) => {
            //             console.log("Message sent successfully!!")
            //         })
            //          sed_res = "";
            //         }

            //       }

            //     });


                


            // }

            

            data = response.body
            var obj = data
            console.log(typeof(obj));
            var y = obj.routes[0].legs[0];
            var len = Object.keys(y['steps']).length;
            // print(y)
            y['steps'].forEach(async(dat) => {
                // console.log(dat)
                
                var sed_res = "";
                sed_res += "{\n" + '"Duration" : ' + '"' + dat.duration + '"' + " ,\n" + '"Key" : ' + '"' + 'mai_hacker_hu' + '"' + " ,\n" + '"Distance" : ' + '"' + dat.distance + '"' + " ,\n" + '"Turn" : ' + '"' + dat['maneuver'].modifier + '"' + ' ,\n'
                var longitute = dat['maneuver']['location'][0]
                var latitude = dat['maneuver']['location'][1]
                var url1 = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + longitute + "," + latitude + ".json?access_token=pk.eyJ1IjoiYWJoaXNoZWs5OTkiLCJhIjoiY2s3Z200dDhsMDEyZTNrcWRrZHpyanlrbCJ9.VP-Hevh7jsp0apFn3Y8KDA"
                request({ url: url1 }, (err, resp = {}) => {
                    if (err) {
                        console.log("Map Error")
                    } else {
                        data1 = resp.body
                        var ob = JSON.parse(data1)
                            // console.log(ob)
                        var place_name = ob.features[0].place_name
                        var text = ob.features[0].text
                    }
                     sed_res += '"Place_name" : ' + '"' + place_name + '"' + " ,\n" + '"Title" : ' + '"' + text + '"' + "\n}"
                    console.log(sed_res)
                    
                     console.log("prepagin to send")
                      client.messages
                        .create({
                            body: sed_res,
                            to: "+916306882685",
                            from: "+12566395258",
                        }).then((message) => {
                            console.log("Message sent successfully!!")
                        })
                    
                        
                })


            })
                   res.send("Complete either fail or pass")
               


            }
          });

        }

   

  });




});

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 1337');
});