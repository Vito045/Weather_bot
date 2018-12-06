const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
    ObjectID
} = require('mongodb');
const {Text} = require('./models/text')
const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');
const port = process.env.PORT || 3000;
var app = express();
var favourites = [];
app.use(bodyParser.json());

const Telegraf = require('telegraf');
const {
    Markup
} = require('telegraf');
const request = require('request');
var adding 
var TOKEN = "680769754:AAFvusu4UO0LBQ8i5dYhZ4vbsw0JCpDr9RU"
var userID
const bot = new Telegraf(TOKEN);
bot.start((ctx) => {
    userID = ctx.update.message.from.id;
    ctx.reply('Hi there!', Markup
            .keyboard([
                ['Search', Markup.locationRequestButton('😎 Send location')], // Row1 with 2 buttons
                ['Favorites']
            ])
            .oneTime()
            .resize()
            .extra());
});

var action

bot.hears('Add', (ctx) => {
    action = 'add'
    ctx.reply('Pls write down text you want add', Markup
            .keyboard([
                ['Back']
            ])
            .oneTime()
            .resize()
            .extra());//.then(() => {
            //     bot.on('text', (ctx) => {
            //         console.log(ctx.message.text)
            //         geocodeAddress(ctx.message.text, (errorMessage, result) => {
            //             if (errorMessage) {
            //                 ctx.reply(errorMessage);
            //             } else {
            //                 userID = ctx.update.message.from.id;
            //                 console.log('df')
            //                 var favourite = new Text({
            //                     text: result.short_name,
            //                     userID
            //                 })
            //                 favourite.save().then((doc) => ctx.reply(`City ${doc.text} was successfuly added`, Markup
            //                 .keyboard([
            //                     ['Back']
            //                 ])
            //                 .oneTime()
            //                 .resize()
            //                 .extra()), (e) => console.log(e));
            //             }
            //         })
            //     });
            // });
        
    
});

bot.hears('Favorites', (ctx) => {
    userID = ctx.update.message.from.id;
    var texts = '';
    Text.find({
        userID
    }).then((data) => {
        favourites = [];
        var arr = [];
        if(data.length === 0) {
            ctx.reply('The list of favorites is empty, to add new press add button', Markup
            .keyboard([['Add'], ['Back']])
            .oneTime()
            .resize()
            .extra()).then(() => {
                bot.on('text', (ctx) => {
                    if(action === 'add') {
                        geocodeAddress(ctx.message.text, (errorMessage, result) => {
                            if (errorMessage) {
                                ctx.reply(errorMessage);
                            } else {
                                userID = ctx.update.message.from.id;
                                var test = 0
                                var favourite = new Text({
                                    text: result.short_name,
                                    userID
                                })
                                favourites.forEach(element => {
                                    if(element[0] === favourite.text) {
                                        ctx.reply(`City ${favourite.text} already added`, Markup
                                        .keyboard([
                                            ['Back']
                                        ])
                                        .oneTime()
                                        .resize()
                                        .extra());  
                                        test = 1
                                    }
                                });
                                if(test === 0) {
                                    favourite.save().then((doc) => ctx.reply(`City ${doc.text} was successfuly added`, Markup
                                .keyboard([
                                    ['Back']
                                ])
                                .oneTime()
                                .resize()
                                .extra()), (e) => console.log(e));
                                }
                            }
                        })
                    }
                })
            });
        }else {
        data.forEach((element) => {
            arr.push([`${element.text}`])
            favourites.push([`${element.text}`])
        });
        arr.push(['Add'], ['Remove'], ['Back'])
        ctx.reply('Favorites', Markup
            .keyboard(arr)
            .oneTime()
            .resize()
            .extra()).then(() => {
                action = 'favorite'
                bot.on('text', (ctx) => {
                    if(action === 'add') {
                        geocodeAddress(ctx.message.text, (errorMessage, result) => {
                            if (errorMessage) {
                                ctx.reply(errorMessage);
                            } else {
                                userID = ctx.update.message.from.id;
                                var test = 0
                                var favourite = new Text({
                                    text: result.short_name,
                                    userID
                                })
                                favourites.forEach((element, i) => {
                                    if(element[0] === favourite.text) {
                                        ctx.reply(`City ${favourite.text} already added`, Markup
                                        .keyboard([
                                            ['Back']
                                        ])
                                        .oneTime()
                                        .resize()
                                        .extra());  
                                        test = 1
                                    }
                                });
                                if(test === 0) {
                                    favourite.save().then((doc) => ctx.reply(`City ${doc.text} was successfuly added`, Markup
                                .keyboard([
                                    ['Back']
                                ])
                                .oneTime()
                                .resize()
                                .extra()), (e) => console.log(e));
                                }
                            }
                        })
                    }else if(action === 'remove'){
                        var test2 = 0
                        userID = ctx.update.message.from.id;
        // for (let i = 0; i < favourites.length; i++) {
        //     if(favourites[i][0] === ctx.message.text) {
        //         Text.findOneAndRemove({
        //             text: favourites[i][0],
        //             userID
        //         }).then((city) => {
        //             ctx.reply(`City ${city.text} was successfuly removed`, Markup
        //                 .keyboard([['Back']])
        //                 .oneTime()
        //                 .resize()
        //                 .extra());
        //             test = 1
        //         });
        //         break
        //     }
        // }
        favourites.forEach(element => {
            if(element[0] === ctx.message.text){
                Text.findOneAndRemove({
                    text: element[0],
                    userID
                }).then((city) => {
                    ctx.reply(`City ${city.text} was successfuly removed`, Markup
                        .keyboard([['Back']])
                        .oneTime()
                        .resize()
                        .extra());
                })
                test2 = 1
            }
        });
        // favourite.forEach(element => {
        //     console.log(element)
        // });
        if(test2 === 0) ctx.reply(`City ${ctx.message.text} not found`, Markup
            .keyboard([['Back']])
            .oneTime()
            .resize()
            .extra());
        
                    }else{
                        console.log(action)
                        userID = ctx.update.message.from.id;
                        for (let i = 0; i < favourites.length; i++) {
                            if(favourites[i][0] === ctx.message.text) {
                                Text.findOne({
                                    text: favourites[i][0],
                                    userID
                                }).then((city) => {
                                    console.log(city)
                                    geocodeAddress(ctx.message.text, (errorMessage, result) => {
                                        if (errorMessage) {
                                            ctx.reply(errorMessage);
                                        } else {
                                            address = result.address
                                            getWeather(result.lat, result.lng, (errorMessage, result) => {
                                                if (errorMessage) {
                                                    ctx.reply(errorMessage);
                                                } else {
                                                    var text = `<strong>${address}</strong>
Currently temperature: ${result.temperature}
feels like: ${result.apparentTemperature}
pressure: ${result.pressure}
humidity: ${result.humidity}
windSpeed: ${result.windSpeed}`;
                                                    ctx.reply(text, {
                                                        parse_mode: 'HTML'
                                                    }, Markup
                                                    .keyboard([
                                                        ['Back']
                                                    ])
                                                    .oneTime()
                                                    .resize()
                                                    .extra());
                                                }
                                            });
                                        }
                                    })
                                });
                            }
                            
                        }
                    }
                    
                });
            });
        
        
    }
    }, (e) => console.log(e));  
})

bot.hears('Remove', (ctx) => {
    action = 'remove'
    userID = ctx.update.message.from.id;
    var swaper = []
    favourites.forEach((element, i) => {
        swaper.push(element)
        if(i === favourites.length - 1) swaper.push(['Back'])
    });
    ctx.reply('Choose city you want delete', Markup
        .keyboard(swaper)
        .oneTime()
        .resize()
        .extra());
    // bot.on('text', (ctx) => {
    //     userID = ctx.update.message.from.id;
    //     for (let i = 0; i < favourites.length; i++) {
    //         if(favourites[i][0] === ctx.message.text) {
    //             Text.findOneAndRemove({
    //                 text: favourites[i][0],
    //                 userID
    //             }).then((city) => {
    //                 ctx.reply(`City ${city.text} was successfuly removed`, Markup
    //                     .keyboard([['Back']])
    //                     .oneTime()
    //                     .resize()
    //                     .extra());
    //             });
    //         }
            
    //     }
    // });
})

bot.hears('Search', (ctx) => {
    adding = false
    userID = ctx.update.message.from.id;
    ctx.reply('Pls. write down down city you want to find', Markup
            .keyboard([
                ['Back']
            ])
            .oneTime()
            .resize()
            .extra()).then(() => {
                bot.on('text', (ctx) => {
                    //if(adding === false) {
                        geocodeAddress(ctx.message.text, (errorMessage, result) => {
                            if (errorMessage) {
                                ctx.reply(errorMessage);
                            } else {
                                address = result.address
                                getWeather(result.lat, result.lng, (errorMessage, result) => {
                                    if (errorMessage) {
                                        ctx.reply(errorMessage);
                                    } else {
                                        var text = `<strong>${address}</strong>
Currently temperature: ${result.temperature}
feels like: ${result.apparentTemperature}
pressure: ${result.pressure}
humidity: ${result.humidity}
windSpeed: ${result.windSpeed}`;
                                        ctx.reply(text, {
                                            parse_mode: 'HTML'
                                        });
                                    }
                                });
                            }
                        })
                });
            });
    
});


bot.hears('Back', (ctx) => {
    ctx.reply('Let\'s continue', Markup
            .keyboard([
                ['Search', Markup.locationRequestButton('😎 Send location')], // Row1 with 2 buttons
                ['Favorites']
            ])
            .oneTime()
            .resize()
            .extra());
});
// bot.hears('Favorites', (ctx) => {
//     userID = ctx.update.message.from.id;
//     var texts = '';
//     Text.find({
//         userID
//     }).then((data) => {
//         if(data.length === 0) return false
//         data.forEach(element => {
//             texts = texts + `${element.text} \n`
//         });
//         ctx.reply(texts)
//     }, (e) => console.log(e));
    
// });



var NodeGeocoder = require('node-geocoder');


var temperature = (value) => {
    return Math.round((value - 32) * 5 / 9)
};


var geocodeAddress = (address, callback) => {
    var encodedAddress = encodeURIComponent(address);

    request({
        url: 'https://maps.google.com/maps/api/geocode/json?address=' + encodedAddress + '&key=AIzaSyBgbHO1L9600MkQEghUkA9Y_AzFTWF8yio&language=uk',
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to Goggle servers');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Unable to find that address');
        } else if (body.status === 'OK') {
            console.log(body.results[0].address_components[0].short_name)
            console.log(body.results[0])
            callback(undefined, {
                short_name: body.results[0].address_components[0].short_name,
                result: body,
                location: body.results[0].formatted_address,
                address: body.results[0].formatted_address,
                lat: body.results[0].geometry.location.lat,
                lng: body.results[0].geometry.location.lng
            });
        }
    });
}

var getWeather = (lat, lng, callback) => {
    request({
        url: `https://api.darksky.net/forecast/6c93799f8e694b731ab0490b3d1e1987/${lat},${lng}?extend=hourly,minutely,currently,daily?lang=uk`,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, {
                response: body,
                data: body.hourly.data[0],
                temperature: temperature(body.currently.temperature),
                apparentTemperature: temperature(body.currently.apparentTemperature),
                pressure: Math.round(body.currently.pressure),
                humidity: Math.round(body.currently.humidity * 100),
                windSpeed: Math.round(body.currently.windSpeed)
            });
        } else {
            callback('Unable to fetch weather.');
        }
    });
};

var options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBgbHO1L9600MkQEghUkA9Y_AzFTWF8yio', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

var text = () => {
    return `<strong>${address}</strong>
Currently temperature: ${result.temperature}
feels like: ${result.apparentTemperature}
pressure: ${result.pressure}
humidity: ${result.humidity}
windSpeed: ${result.windSpeed}`;
}

var geocoder = NodeGeocoder(options);
var address

// bot.start(ctx => {
//     ctx.reply('Custom buttons keyboard', Markup
//         .keyboard([
//             ['Search', Markup.locationRequestButton('😎 Send location')] // Row1 with 2 buttons
//         ])
//         .oneTime()
//         .resize()
//         .extra()
//     );
// });

bot.on('location', (ctx) => {
    request({
        url: 'https://maps.google.com/maps/api/geocode/json?address=' + ctx.message.location.latitude + ',' + ctx.message.location.longitude + '&key=AIzaSyBgbHO1L9600MkQEghUkA9Y_AzFTWF8yio&language=uk',
        json: true
    }, (error, response, body) => {
        if (error) {
            console.log('Unable to connect to Goggle servers');
        } else if (body.status === 'ZERO_RESULTS') {
            console.log('Unable to find that address');
        } else if (body.status === 'OK') {
            console.log(body.results[0].address_components[0].long_name)
            var city = body.results[0].address_components[0].short_name;
            address = body.results[0].formatted_address
            getWeather(ctx.message.location.latitude, ctx.message.location.longitude, (errorMessage, result) => {
                if (errorMessage) {
                    ctx.reply(errorMessage);
                } else {
                    console.log(result.response)
                    // var time = new Date(result.data.time * 1000);

                    // console.log(time)

                    var text = `<strong>${address}</strong>
Currently temperature: ${result.temperature}
feels like: ${result.apparentTemperature}
pressure: ${result.pressure}
humidity: ${result.humidity}
windSpeed: ${result.windSpeed}`;
                    ctx.reply(text, {
                        parse_mode: 'HTML'
                    })
                }
            });
        }
    });

});

app.listen(port, () => {
    console.log('Started on port', port);
});

bot.startPolling();
