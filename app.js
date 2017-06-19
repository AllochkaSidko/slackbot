var Botkit = require('botkit')
var cron = require('node-cron');
var HashMap = require('hashmap');
var mysql = require('mysql');

var channelId = 'C5K9XRGQ4';

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",//"12345",
  database: "botdb"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


var token = 'xoxb-192818834532-ePVVVPkuJmSXwBFXwzteeVic'
var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
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
// Otherwise assume multi-team mode - setup beep boop resourcer connection
//} else {
//  console.log('Starting in Beep Boop multi-team mode')
 // require('beepboop-botkit').start(controller, { debug: true })
//}


controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})


var map = new HashMap();
insertIntoMap();
 
cron.schedule('* * * * *', function()
{
  //TODO ?? first of sorted
  map.forEach(function(value, key) 
  {
    var now = new Date();
    var date = new Date(value);
    checkDate(date,now, key);

    var month = new Date(now);
    month.setMonth(now.getMonth()+1);
    checkDate(date, month, 'Month left to deadline ' + key);

    var tendays = new Date(now);
    tendays.setDate(now.getDate()+10);
    checkDate(date, tendays, '10 days left to deadline ' + key);

    var weekdate = new Date(now);
    weekdate.setDate(now.getDate()+7);
    checkDate(date, weekdate, '7 days left to deadline ' + key);

    var threedays = new Date(now);
    threedays.setDate(now.getDate()+3);
    checkDate(date, threedays, '3 days left to deadline ' + key);

    var oneday = new Date(now);
    oneday.setDate(now.getDate()+1);
    checkDate(date, oneday, 'One day left to deadline ' + key);
    
    var hour = new Date(now);
    hour.setHours(now.getHours()+1);
    checkDate(date, hour, 'Be careful!!! Only one hour left to deadline ' + key);

    var half = new Date(now);
    half.setMinutes(now.getMinutes()+30);
    checkDate(date, half, 'Be careful!!! 30 minutes left to deadline ' + key);

    var five = new Date(now);
    five.setMinutes(now.getMinutes()+5);
    checkDate(date, five, '5 minutes left to deadline ' + key);

  });
});


function checkDate(date,checkdate, text)
{
 
  if(checkdate.getFullYear() == date.getFullYear()&&checkdate.getMonth() == date.getMonth()&&checkdate.getDate() == date.getDate()
     &&checkdate.getHours() == date.getHours()&& checkdate.getMinutes() == date.getMinutes())
     {
     console.log(text);

        bot.startConversation({
            //!!!user: 'U5JM7JLKB' ,
            channel: channelId, 
        }, (err, convo) => {
           // convo.say('@channel')
            convo.say(text)
        });
        
     }

}

controller.hears('channel',['direct_message', 'direct_mention', 'mention'],function(bot, message) {
         bot.reply(message,'Now notifications will be send in channel with id '+channelId);
});

controller.hears('change',['direct_message', 'direct_mention', 'mention'],function(bot, message) {
        bot.startConversation(message,function(err,convo) {
        convo.addQuestion('Enter new channel id.',function(response,convo) {
          channelId = response.text;
          convo.say('Now channel id is '+channelId);
          convo.say('Don\'t forget to invite me to this channel!');
          convo.next();
           },
    {},'default');
        })
});


function deleteInvalidDate()
{
  map.forEach(function(value, key) {
    var date = new Date(value);
    if(!checkInvalidDate(date))
       {
         map.remove(key);
         removeFromDB(key);
       }
  })
}



function checkInvalidDate(date)
{
  var now = new Date();
  
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
  if(!map.keys().length) return 'No deadlines!!!';
  var array = map.values().sort();
  return  map.search(array[0]) + ' ' + array[0].replace(/T/, ' ');

}

 
controller.hears(
  ['hello', 'hi', 'halo'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, 'Hello! I\'m notification bot!\n\n If you will need a help just type help and I\'m trying to help you! ' ) })

var helpmsg = 'I heard that you need my help!\n So, if you want to see your deadlines type - all\n'+
'To see nearest deadline type - deadline\n' + 'To add new deadlines - add\n' + 
'To delete - delete\n'+'To see channel id, in wich notifications will be sent, type - channel\n'+
'To change this id - change';
controller.hears(
  ['help'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, helpmsg ) })

  controller.hears(
  ['deadline'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, firstdate())})


function printall()
{
    deleteInvalidDate();
    if(!map.keys().length) return 'No deadlines!!!';
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
                            removeFromDB(namedelete);
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
     convo.addQuestion('I heard that you want to add new deadline!Enter password to add.',function(response,convo)
    {
         var enteredpass = response.text
         if(enteredpass==='12345') 
         { 
            convo.addQuestion('Ok, enter name of your deadline.',function(response,convo) 
            {
                newname = response.text
                convo.say('Cool your deadline: ' + response.text);
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
                    convo.say('Such deadline already exists!Please, try another name:');
                    convo.next();   
                }else{
                    map.set(newname, newDateTime);
                    addIntoDB(newname, newDateTime);
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


function addIntoDB(addname,adddate)
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
//<<<<<<< HEAD
    con.query("SELECT * FROM deadlines", function (err, result) 
    {
        if (err) throw err;
        console.log(result);
        result.forEach(function(item)
        {
            map.set(item.name, item.date)
            console.log(map.get(item.name)+'\n');
        })
    });
//=======
con.query("SELECT * FROM deadlines", function (err, result) {
    if (err) throw err;
    result.forEach(function(item)
    {
      map.set(item.name, item.date)
    })
});
//>>>>>>> 5cbaa93d5c2f6078872821f5e1dc4a8875a08e85
}


 