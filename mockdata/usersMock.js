const fs = require("fs");
const { Parser } = require("json2csv");
const moment = require('moment');


generateUsersMockData = () => {
  const data = [];
  // Loop through each time interval between start and end date
  for (var x = 0; x < 20 ; x++) {
    var firstnameArr = [
      'Isabella', 'Cameron', 'Lydia', 'Caleb', 'Sophie', 'Liam', 'Elena', 'Nathan', 'Zoe', 'Samuel',
      'Aria', 'Lucas', 'Mia', 'Ethan', 'Hazel', 'Jacob', 'Chloe', 'Oliver', 'Lila', 'William',
      'Violet', 'Logan', 'Emma', 'Noah', 'Leah', 'Benjamin', 'Stella', 'Elijah', 'Grace', 'Mason',
      'Hannah', 'Alexander', 'Avery', 'Daniel', 'Madelyn', 'Matthew', 'Ella', 'David', 'Natalie', 'Michael',
      'Maya', 'Jackson', 'Aubrey', 'Joseph', 'Lily', 'Henry', 'Penelope', 'Aiden', 'Addison', 'Christopher',
      'Abigail', 'Joshua', 'Sofia', 'Evelyn', 'Anna', 'Andrew', 'Elizabeth', 'Gabriel', 'Aaliyah', 'Nicholas',
      'Brooklyn', 'Anthony', 'Arianna', 'Eva', 'Savannah', 'Tyler', 'Bella', 'Sebastian', 'Victoria', 'Max',
      'Audrey', 'Jaxon', 'Claire', 'Makayla', 'Nora', 'Owen', 'Isabelle', 'Wyatt', 'Alyssa', 'Julian',
      'Avery', 'Jonathan', 'Ellie', 'Carter', 'Mila', 'Grayson', 'Peyton', 'Levi', 'Caroline', 'Lincoln',
      'Lee', 'Garcia', 'Chen', 'Davis', 'Nguyen', 'Lopez', 'Patel', 'Smith', 'Gonzalez', 'Wilson'
    ]
    var lastnameArr = [
      'Gonzalez', 'Parker', 'Perry', 'Graham', 'Reed', 'Boyd', 'Morrison', 'Morgan', 'Howell', 'Bryant',
      'Manning', 'Pearson', 'Griffin', 'Harrison', 'Kim', 'Austin', 'Stewart', 'Henderson', 'Ramos', 'Cruz',
      'Wood', 'Cook', 'Wright', 'Jordan', 'Fisher', 'Long', 'Banks', 'Robinson', 'Nichols', 'Hunt',
      'Stephens', 'Howard', 'Hansen', 'Burns', 'Snyder', 'Gibson', 'Hicks', 'Cooper', 'Mcdonald', 'Ramirez',
      'Murray', 'Freeman', 'Brooks', 'Simpson', 'Powell', 'Roberts', 'Gomez', 'Barnes', 'Rodriguez', 'Adams',
      'Hudson', 'Fleming', 'Wallace', 'Cole', 'Allen', 'West', 'Mendoza', 'Riley', 'Chavez', 'Schmidt',
      'Bishop', 'Baker', 'Gray', 'Castillo', 'Gardner', 'Lawson', 'Bryant', 'Stevens', 'Johnston', 'Baldwin',
      'Herrera', 'Fox', 'Ortiz', 'Boone', 'Sanchez', 'Berry', 'Meyer', 'Duncan', 'Schneider', 'Garrett',
      'Collins', 'Mills', 'Frazier', 'Moreno', 'Kim', 'Nguyen', 'Beck', 'Bennett', 'Black', 'Lucas',
      'Liam', 'Avery', 'Nora', 'Sofia', 'Ethan', 'Charlotte', 'Mason', 'Aiden', 'Aria', 'Evelyn'
    ]
    var usernameArr = [
      'funkyPanda23', 'sparklingSunflower', 'lilahKoo111', 'daringAdventurer', 'neonNinja42', 'moonlightDreamer', 'happyHiker12', 'colorfulParrot', 'sillySquirrel27', 'wildWolf87',
      'brightButterfly', 'creativeCactus', 'coolCaterpillar', 'funnyFlamingo', 'giantGiraffe', 'happyHedgehog', 'jollyJaguar', 'livelyLlama', 'mightyMoose', 'niftyNarwhal',
      'orangeOctopus', 'perfectPenguin', 'quirkyQuail', 'redRaccoon', 'shySalamander', 'terrificTurtle', 'uniqueUnicorn', 'vividVulture', 'wanderingWombat', 'xenialXenon',
      'yellowYak', 'zealousZebra', 'adventurousAnt', 'braveBeaver', 'curiousCat', 'daringDeer', 'eagerElephant', 'fearlessFox', 'gracefulGazelle', 'happyHippopotamus',
      'intrepidIguana', 'jovialJellyfish', 'kindKangaroo', 'livelyLadybug', 'merryMole', 'nobleNightingale', 'optimisticOtter', 'playfulPanda', 'quietQuokka', 'restlessRaven',
      'shimmeringShark', 'toughTiger', 'unforgettableUrchin', 'vibrantViper', 'wonderfulWhale', 'xenophobicXerus', 'youngYabby', 'zealousZander', 'amazingAnaconda', 'brilliantBadger',
      'crazyCrab', 'dazzlingDragonfly', 'energeticEagle', 'funkyFalcon', 'greatGorilla', 'happyHamster', 'inquisitiveIbis', 'jollyJay', 'keenKoala', 'lovelyLion',
      'mischievousMonkey', 'nimbleNewt', 'outgoingOstrich', 'peacefulPolarBear', 'quirkyQuokka', 'radiantRabbit', 'sillySeal', 'tenaciousToucan', 'upbeatUrial', 'victoriousVole',
      'wittyWalrus', 'xenodochialXanthareel', 'youngYak', 'zanyZebra', 'adaptableAlpaca', 'boldBison', 'caringCaribou', 'determinedDingo', 'elegantEmu', 'fierceFrog',
      'grinningGoat', 'humbleHare', 'industriousIbis', 'jumpyJackrabbit', 'kindlyKiwi', 'luminousLobster', 'mightyMantaRay', 'nobleNarwhal', 'optimisticOcelot', 'preciousPuma'
  ]
    var emailArr = [
      'george.williams94@example.com', 'jennifer.rodriguez54@example.com', 'michael.foster67@example.com', 'laura.mitchell32@example.com', 'william.howard23@example.com', 'sarah.hughes55@example.com', 'david.collins89@example.com', 'jessica.evans42@example.com', 'matthew.adams78@example.com', 'elizabeth.ramirez12@example.com',
      'christopher.jenkins56@example.com', 'natalie.kelly46@example.com', 'andrew.gonzales28@example.com', 'emily.taylor79@example.com', 'anthony.roberts64@example.com', 'ashley.murphy37@example.com', 'james.bell87@example.com', 'amanda.nelson23@example.com', 'joseph.hall14@example.com', 'samantha.carter45@example.com',
      'benjamin.hernandez83@example.com', 'kimberly.peterson18@example.com', 'john.wright75@example.com', 'katherine.baker91@example.com', 'nicholas.allen62@example.com', 'lauren.johnson68@example.com', 'jacob.green39@example.com', 'stephanie.king84@example.com', 'ethan.lewis29@example.com', 'tiffany.edwards72@example.com',
      'ryan.campbell98@example.com', 'brittany.richardson19@example.com', 'daniel.lee24@example.com', 'julia.turner41@example.com', 'kevin.james73@example.com', 'rebecca.white81@example.com', 'patrick.anderson43@example.com', 'megan.harris69@example.com', 'brandon.martin97@example.com', 'emily.clark27@example.com',
      'justin.perez61@example.com', 'melissa.thomas52@example.com', 'robert.jackson48@example.com', 'victoria.hernandez38@example.com', 'tyler.thompson33@example.com', 'kayla.moore76@example.com', 'richard.davis22@example.com', 'alyssa.walker63@example.com', 'cody.miller53@example.com', 'olivia.johnston85@example.com',
      'dylan.nelson49@example.com', 'ashley.garcia77@example.com', 'william.collins57@example.com', 'samantha.young66@example.com', 'ethan.foster31@example.com', 'jessica.diaz15@example.com', 'michael.ward26@example.com', 'natalie.cook47@example.com', 'matthew.jones92@example.com', 'lauren.robertson58@example.com',
      'jacob.sanchez44@example.com', 'katherine.mitchell96@example.com', 'andrew.edwards11@example.com', 'emily.ramirez93@example.com', 'anthony.martinez71@example.com', 'amanda.turner65@example.com', 'james.kelly16@example.com', 'samantha.hernandez86@example.com', 'joseph.clark59@example.com', 'elizabeth.brown25@example.com',
      'jane.doe72@hotmail.com', 'john.smith84@gmail.com', 'samantha.jackson33@yahoo.com', 'david.nguyen57@outlook.com', 'maria.garcia46@icloud.com', 'james.robinson89@protonmail.com', 'ashley.williams62@gmail.com', 'william.jones28@outlook.com', 'olivia.brown45@yahoo.com', 'michael.davis93@hotmail.com',
      'emily.thomas16@gmail.com', 'daniel.martinez71@yahoo.com', 'lauren.hernandez82@icloud.com', 'christopher.taylor59@outlook.com', 'jessica.rodriguez14@hotmail.com', 'matthew.anderson77@gmail.com', 'natalie.lee88@yahoo.com', 'joseph.wright52@protonmail.com', 'sophia.perez41@icloud.com', 'andrew.miller75@outlook.com',
      'amber.johnson36@hotmail.com', 'roberto.gonzalez68@gmail.com', 'grace.diaz23@yahoo.com', 'nathan.baker56@icloud.com', 'isabella.harris49@outlook.com', 'jonathan.jackson31@protonmail.com', 'emma.parker98@gmail.com', 'alexander.green79@yahoo.com', 'mia.campbell64@icloud.com', 'benjamin.collins27@outlook.com'
    ]
      var urlArr = ["https://cdn-icons-png.flaticon.com/128/8398/8398242.png","https://cdn-icons-png.flaticon.com/128/8398/8398263.png","https://cdn-icons-png.flaticon.com/128/8398/8398201.png","https://cdn-icons-png.flaticon.com/128/8398/8398337.png","https://cdn-icons-png.flaticon.com/128/8398/8398295.png","https://cdn-icons-png.flaticon.com/128/8398/8398309.png"];
      var randomURLIndex = x % 6
      data.push({
        id: x+1,
        username: usernameArr[x],
        firstname: firstnameArr[x],
        lastname: lastnameArr[x],
        email: emailArr[x],
        profilepic_URL: urlArr[randomURLIndex]
      });
  }
  const fileName = 'userMock.csv'
  const fields = ["id", "username", "firstname", "lastname", "email", "profilepic_URL"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);
  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log(`Saved ${data.length} rows of mock data to ${fileName}`);
  });
}

generateUsersMockData()