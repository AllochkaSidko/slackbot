var Botkit = require('botkit')
var cron = require('node-cron');
var HashMap = require('hashmap');
//var mysql = require('mysql');
var http = require('http');

var channelId = 'C5JAU2K9C';

/*var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",//"12345",
  database: "botdb"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

//loads http module
var app=http.createServer(function (req, res) {
//creates server
  res.writeHead(200, {'Content-Type': 'text/plain'});
  //sets the right header and status code
  res.end('Hello World\n');
  //outputs string with line end symbol
});
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var token = process.env.TOKEN


var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false,
  require_delivery: true
 

})

// Assume single team mode if we have a SLACK_TOKEN
if (!token) {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}
 // console.log('Starting in single-team mode')
 var bot =  controller.spawn({
    token: token

  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })


controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "Hello!:wave:  My name is deadliner!\n I'm here to help you not to miss your deadlines!")
})


var map = new HashMap();
//insertIntoMap();
 
cron.schedule('* * * * *', function()
{
  //TODO ?? first of sorted
  map.forEach(function(value, key) 
  {
    var now = new Date();
    //now.setHours(now.getHours()+1);
    var date = new Date(value);
    var msg = {'text' :'Your deadline is closed!',icon_emoji: ":champagne:", 'attachments': [ {"title": key, "color": "#000000",
    'image_url' : 'https://static1.squarespace.com/static/5783a7e19de4bb11478ae2d8/t/5821d2ea09e1c46748737af1/1478614300894/shutterstock_217082875-e1459952801830.jpg'}]} 
    checkDate(date,now, msg);

    var month = new Date(now);
    month.setMonth(now.getMonth()+1);
    msg = {'text' :'Month left to deadline!',icon_emoji: ":crescent_moon:", 'attachments': [ {"title": key, "color": "#ffccff",
    'image_url' : 'http://www.pr4ngo.eu/wp-content/uploads/2015/01/do-not-keep-calm-bitch-you-have-a-deadline.png'}]} 
    checkDate(date, month, msg);

    var tendays = new Date(now);
    tendays.setDate(now.getDate()+10);
    msg = {'text' :'10 days left to deadline! ',icon_emoji: ":crystal_ball:", 'attachments': [ {"title": key, "color": "#990099",
    'image_url' : 'http://hirologos.in.ua/images/stories/jokes/vizhu-dedlajn.jpg'}]}  
    checkDate(date, tendays, msg);

    var weekdate = new Date(now);
    weekdate.setDate(now.getDate()+7);
    msg = {'text' :'7 days left to deadline! ',icon_emoji: ":hankey:", 'attachments': [ {"title": key, "color": "#2d862d",
    'image_url' : 'http://cs8.pikabu.ru/post_img/2016/07/30/11/1469906048174756713.jpg'}]}  
    checkDate(date, weekdate, msg);

    var threedays = new Date(now);
    threedays.setDate(now.getDate()+3);
     msg = {'text' :'3 days left to deadline! ',icon_emoji: ":smiling_imp:", 'attachments': [ {"title": key, "color": "#6699ff",
    'image_url' : 'http://phptime.ru/uploads/images/00/00/01/2013/01/17/cc7330.jpg'}]}  
    checkDate(date, threedays, msg);

    var oneday = new Date(now);
    oneday.setDate(now.getDate()+1);
     msg = {'text' :'One day left to deadline! ',icon_emoji: ":tired_face:", 'attachments': [ {"title": key, "color": "#ffff33",
    'image_url' : 'http://everest-center.com/wp-content/uploads/Dedlajn-vzhe-blizko.jpg'}]}  
    checkDate(date, oneday, msg);
    
    var hour = new Date(now);
    hour.setHours(now.getHours()+1);
     msg = {'text' :'Be careful!!! Only one hour left to deadline! ',icon_emoji: ":runner:", 'attachments': [ {"title": key, "color": "#ff6600",
    'image_url' : 'http://cdn2.thegrindstone.com/wp-content/uploads/2013/08/woman-missed-deadline.jpg'}]}  
    checkDate(date, hour, msg);

    var half = new Date(now);
    half.setMinutes(now.getMinutes()+30);
     msg = {'text' :'Be careful!!! 30 minutes left to deadline! ',icon_emoji: ":tornado:", 'attachments': [ {"title": key, "color": "#ff0066",
    'image_url' : 'http://begin-english.ru/img/word/deadline.jpg'}]}  
    checkDate(date, half, msg);

    var five = new Date(now);
    five.setMinutes(now.getMinutes()+5);
     msg = {'text' :'5 minutes left to deadline! ',icon_emoji: ":bomb:", 'attachments': [ {"title": key, "color": "#e60000",
    'image_url' : 'http://www.smh.com.au/cqstatic/gn4tk9/animatedidea.gif'}]}  
   
    checkDate(date, five, msg);

  });
});


function checkDate(date,checkdate, text)
{
 
  if(checkdate.getFullYear() == date.getFullYear()&&checkdate.getMonth() == date.getMonth()&&checkdate.getDate() == date.getDate()
     &&checkdate.getHours() == date.getHours()&& checkdate.getMinutes() == date.getMinutes())
     {
     console.log(text);
        bot.startConversation({
            channel: channelId, 
        }, (err, convo) => {
            convo.say(date + '\n' + checkdate)
        });
        
     }

}

controller.hears('channel',['direct_message', 'direct_mention', 'mention'],function(bot, message) {
         bot.reply(message,'Now notifications will be send in channel with id '+channelId);
});

var now = new Date()
//now.setHours(now.getHours()+1);

cron.schedule('* * * * *', function()
{
   now = new Date();
  //now.setHours(now.getHours()+1);
  
});

controller.hears('date',['direct_message', 'direct_mention', 'mention'],function(bot, message) {
         bot.reply(message,'now is '+ now.getHours() + ' ' + now.getMinutes()+'\n'+now);
});


controller.hears('change',['direct_message', 'direct_mention', 'mention'],function(bot, message) {
        bot.startConversation(message,function(err,convo) {
           convo.addQuestion('Enter password to change channel id',function(response,convo) 
            {
                var enteredpass = response.text
                if(enteredpass==='12345') 
                { 
                  convo.addQuestion('Enter new channel id.',function(response,convo) {
                    channelId = response.text;
                    convo.say('Now channel id is '+channelId);
                    convo.say('Don\'t forget to invite me to this channel!');
                    convo.next();
           },
        {},'default');
                }
       else 
            convo.say('Wrong password!!!');
            convo.next();
          },{},'default');  
        })
});


function deleteInvalidDate()
{
  map.forEach(function(value, key) {
    var date = new Date(value);
    if(!checkInvalidDate(date))
       {
         map.remove(key);
         //removeFromDB(key);
       }
  })
}



function checkInvalidDate(date)
{
  var now = new Date();
//now.setHours(now.getHours()+1);

    if(now.getFullYear() > date.getFullYear())
      return false;
    
    if(now.getFullYear() < date.getFullYear())
      return true;

    if(now.getMonth() > date.getMonth())
      return false;

    if(now.getMonth() < date.getMonth())
     return true;

    if(now.getDate() > date.getDate())
    return false; 
    
    if(now.getDate() < date.getDate())
      return true;
 
    if(now.getHours() > date.getHours())
      return false;
      
    if(now.getHours() < date.getHours())
      return true;
 
    if(now.getMinutes() > date.getMinutes())
      return false;

    return true;
 
}

function firstdate(){
  deleteInvalidDate();
  if(!map.keys().length) return 'You don\'t have any deadlines! :tada:';
  var array = map.values().sort();
  return  map.search(array[0]) + ' ' + array[0].replace(/T/, ' ');

}

controller.hears(
  ['hello', 'hi', 'halo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message,'Hello!\n If you will need a help just type help and I\'m trying to help you!:wink:' ) })

var helpmsg = 'I heard that you need my help!:thinking_face: \n So, if you want to see your deadlines type - all\n'+
'To see nearest deadline type - deadline\n' + 'To add new deadlines - add\n' + 
'To delete - delete\n'+'To see channel id, in wich notifications will be sent, type - channel\n'+
'To change this id - change';

controller.hears(
  ['help'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, helpmsg ) })

  controller.hears(
  ['deadline'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, ':fire: ' +firstdate())})


function printall()
{
    deleteInvalidDate();
    if(!map.keys().length) return  'You don\'t have any deadlines! :tada:';
    var s=''
    map.forEach(function(value, key)
    {
        s+=key+' '+value.replace(/T/, ' ')+' \n'
    })
    return s;
}

  controller.hears(
  ['all'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, printall() )})

  
  // delete deadLine
  
  controller.hears(
  ['delete'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) 
  {   
        bot.startConversation(message,function(err,convo) 
        {
            convo.addQuestion('Enter password to delete.',function(response,convo) 
            {
                var enteredpass = response.text
                if(enteredpass==='12345') 
                { 
                    convo.addQuestion('Enter name of deadline you want to delete.',function(response,convo) 
                    {
                        var namedelete = response.text;
                        if(map.has(namedelete))
                        {
                            map.remove(namedelete);  
                            //removeFromDB(namedelete);
                            convo.say(namedelete + ' removed!');
                        }
                        else 
                            convo.say('Such deadline doesn\'t exist!');
                        convo.next();  
                    },{},'default');
            }
            else 
                convo.say('Wrong password!!!');
            convo.next();
            },{},'default');  
        })
  })

// add new deadline  
//TODO validation
controller.hears(['add'],  ['direct_message', 'direct_mention', 'mention'], function(bot,message)
{
    var newname = ''
    var newdate = ''
    var newtime = ''
    
    // start a conversation to handle this response.
    bot.startConversation(message,function(err,convo) 
    {
     convo.addQuestion('I heard that you want to add new deadline!\nFirst, Enter password ',function(response,convo)
    {
         var enteredpass = response.text
         if(enteredpass==='12345') 
         { 
            convo.addQuestion('Ok, enter name of your deadline.',function(response,convo) 
            {
                newname = response.text
                convo.say('Cool! Your deadline: ' + response.text);
                convo.next(); 
            },{},'default');

        convo.addQuestion('What date of your deadline? Format YYYY-MM-DD',function(response,convo) 
        {
            newdate = response.text
            convo.say('Date: ' + response.text);
            convo.next();   
        },{},'default');

        convo.addQuestion('What about time? Format HH:MM',function(response,convo) 
        {
            newtime = response.text
            var newDateTime = newdate+'T'+newtime;
            if(!checkInvalidDate(new Date(newDateTime)) )
            { 
                convo.say('Invalid date!Try again');
                convo.next()
             }
             else
             {
                if(map.has(newname))
                {
                    convo.say('Such deadline already exists!Please, try another name');
                    convo.next();   
                }else{
                    map.set(newname, newDateTime);
                    //addIntoDB(newname, newDateTime);
                    convo.say('Time: ' + response.text);
                    convo.next();  
                }
            }
        },{},'default');
  }
        else 
            convo.say('Wrong password!!!');

 convo.next();
        
    },{},'default');
  })
});


/*function addIntoDB(addname,adddate)
{
    var sql = "INSERT INTO deadlines (name, date) VALUES ?";
    var value = [[addname, adddate]];
    con.query(sql,[value], function (err, result) 
    {
        if (err) throw err;
            console.log("1 record inserted");
    });
}
function removeFromDB(deletename)
{
    var sql = "DELETE FROM deadlines WHERE name = ?";
    con.query(sql,deletename, function (err, result) 
    {
        if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);
    });
}
function insertIntoMap()
{
con.query("SELECT * FROM deadlines", function (err, result) {
    if (err) throw err;
    result.forEach(function(item)
    {
      map.set(item.name, item.date)
    })
});
}
*/
