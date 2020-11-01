const express = require("express");
const http = require('http');
const request = require('request')
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var call_loc = require('./reverseGeocoding')
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

var data = ""

var loc = ""
let cnt = 0

app.post('/sms', (req, res) => {
    console.log(req.body.phoneNumber)
    var number = req.body.phoneNumber
    var longituteS = req.body.log;
    var latitudeS = req.body.lat;
    var destinationAddress = req.body.destination;


    console.log(destinationAddress, toNumber);
    geocode(destinationAddress, (erro, { longitute: longituteD, latitude: latitudeD } = {}) => {
        if (erro) {
            return res.send({
                error: 'Try another name pls!'
            })
        } else {

            var url = "https://router.project-osrm.org/route/v1/driving/" + longituteS + "," + latitudeS + ";" + longituteD + "," + latitudeD + "?geometries=geojson&alternatives=true&steps=true&generate_hints=false"

            var accountSid = "AC81dd8a5c2996e317723991b0e81e3f2b";
            var authToken = 'e20cee8b4dc766edf7483251339341e6';

            var twilio = require("twilio");
            var client = new twilio(accountSid, authToken);
            request({ url: url }, (error, response = {}) => {
                if (error) {
                    console.log("Map Error")
                } else {
                    data = response.body
                    var obj = JSON.parse(data)
                    console.log(typeof(obj));
                    var y = obj.routes[0].legs[0];
                    var len = Object.keys(y['steps']).length;
                    // print(y)
                    y['steps'].forEach(async(dat) => {
                        // console.log(dat)
                        var sed_res = "";

                        sed_res += "{\n" + '"Duration" : ' + '"' + dat.duration + '"' + " ,\n" + '"Key" : ' + '"mai_hacker_hu"' + " ,\n" + '"Distance" : ' + '"' + dat.distance + '"' + " ,\n" + '"Turn" : ' + '"' + dat['maneuver'].modifier + '"' + ' ,\n'

                        var longitute = dat['maneuver']['location'][0]
                        var latitude = dat['maneuver']['location'][1]

                        var url1 = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + longitute + "," + latitude + ".json?access_token=pk.eyJ1IjoiYWJoaXNoZWs5OTkiLCJhIjoiY2s3Z200dDhsMDEyZTNrcWRrZHpyanlrbCJ9.VP-Hevh7jsp0apFn3Y8KDA"

                        request({ url: url1 }, (err, resp = {}) => {

                            if (err) {
                                console.log("Map Error")
                            } else {
                                var data1 = resp.body
                                var ob = JSON.parse(data1)
                                    // console.log(ob)
                                var place_name = ob.features[0].place_name
                                var text = ob.features[0].text
                            }

                            sed_res += '"Place_name" : ' + '"' + place_name + '"' + " ,\n" + '"Title" : ' + '"' + text + '"' + "\n}" + "\n"
                            console.log(sed_res)

                            client.messages
                                .create({
                                    body: sed_res,
                                    to: number,
                                    from: "+17657404574",
                                }).then((message) => {
                                    console.log("Message sent successfully!!")
                                })

                        })


                    })



                }


            })

            res.send("All the message was send successfully\n")

        }

    });
})



http.createServer(app).listen(5000, () => {
    console.log('Express server listening on port 5000');
});
