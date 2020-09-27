const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '-';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//Bot initiation sequence
client.once('ready', () => {
    console.log('\nMarqueeBot is Online!\n');
});

//Creating object
var discrim = new Object();

//Allows interaction for each message sent
client.on('message', message =>{

//Looks at individual message authors and reacts to one
    var person = (message.author.discriminator);
    //console.log(person);
    //client.commands.get('react').execute(message, args);
    //if(person === '5474'){
    //    message.react('💩');
    //}

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();


    if(command === 'ping'){
        message.channel.send('pong!');
    } else if(command === 'marquee'){
        client.commands.get('Marquee').execute(message, args);
    } else if(command == "help") {
        message.channel.send('To see coronavirus case numbers choose from <source>\nSOurces: <CDC> <WHO>\nUse the command:\n-marquee <source> <date>')
    }
});


client.login('*');