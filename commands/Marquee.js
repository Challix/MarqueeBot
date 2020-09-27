const got = require('got');

const credentials = {
    client: {
        id: '35384dae8da441359c8db2687b736e57',
        secret: '2fcae8384d78f61d0b63b6e522ce2bd753cf64be4a323a71fce5de94c73163ca',
    },
    auth: {
        tokenHost: 'https://idfs.gs.com',
        authorizePath: '/as/authorization.oauth2',
        tokenPath: '/as/token.oauth2?scope=read_product_data',
    }
};

const getDataSets = (t) => {
    const opts = { headers: { Authorization: 'Bearer ' + t.token.access_token, "Content-Type": "application/json" } };
    return got('https://api.marquee.gs.com/v1/users/self', opts)
        .then(r => r.body)
    ;
};

const oauth2 = require('simple-oauth2').create(credentials);

//Set conditional variables from discord command
var date = "";
var limit = 0;

module.exports = {
    name: 'Marquee',
    description: "this the command for utilizing the Marquee API!",
    execute(message, args){
        date = args;
        limit = args;
        console.log('\n', date, limit, '\n');
        message.channel.send('Marquee!');
    }
}

var CDC_data;
var WHO_data;
var wiki_data;

//calls upon data sets
const callApi = (t) => {
    const args = {
        "headers": {
            "Authorization": "Bearer " + t.token.access_token,
            "Content-Type": "application/json"
        },
        "json": {
                "where": {
                    "countryId": ["US"]
                },
                "startDate": "2020-01-01",
                "limit": 500
            },
        //"json": true
    };

    got.post("https://api.marquee.gs.com/v1/data/COVID19_US_DAILY_CDC/query", args)
        .then(response => CDC_data = (response.body), console.error.bind(console))

    got.post("https://api.marquee.gs.com/v1/data/COVID19_COUNTRY_DAILY_WHO/query", args)
        .then(response => WHO_data = (response.body), console.error.bind(console))

    // got.post("https://api.marquee.gs.com/v1/data/COVID19_COUNTRY_DAILY_WIKI/query", args)
    //     .then(response => wiki_data = (response.body), console.error.bind(console))
};

    
    oauth2.clientCredentials
          .getToken({})
          .then(r => oauth2.accessToken.create(r))
          .then(callApi)
          .then(console.log, console.error);

// var parts = data.split(/[{]/);
//console.log(data);

module.exports = {
    name: 'Marquee',
    description: "this the command for utilizing the Marquee API!",
    execute(message, args){

        var displaydata;

        if(args == '') {
            message.channel.send("Give a date:\n-marquee <dataset> <date>");
        } else if(args[0] == 'CDC' || args[0] == 'cdc') {
            displaydata = CDC_data;
            //console.log('CDC data\n');
            var num = displaydata.search(args[1]);
            num += 29;
            //console.log(num);
            var endnum = displaydata.indexOf(',',num);
        } else if(args[0] == 'WHO' || args[0] == 'who'){
            displaydata = WHO_data;
            //console.log(args[1]);
            var num = displaydata.search(args[1]);
            num += 70;
            var endnum = displaydata.indexOf(',',num);
            //console.log(num);
        } 
        if(num == -1) {
            message.channel.send("No data from that date");
        } else {
            message.channel.send(displaydata.substring(num,endnum));
        }
        
        //console.log(wiki_data);
    }
}