const { IgApiClient } = require('instagram-private-api');
const ig = new IgApiClient();

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
process.env.IG_USERNAME = 'your username';
process.env.IG_PASSWORD = 'your password';
ig.state.generateDevice(process.env.IG_USERNAME);
// Optionally you can setup proxy url
ig.state.proxyUrl = process.env.IG_PROXY;
(async () => {
  // Execute all requests prior to authorization in the real Android application
  // Not required but recommended
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const followersFeed = ig.feed.accountFollowers(loggedInUser.pk);
  const followers = await followersFeed.request();
  const followingFeed = ig.feed.accountFollowing(loggedInUser.pk);
  const followings = await followingFeed.request();
  
  console.log('Not following me:');
  for (var i = 0; i < followings.users.length; i++) 
  {
    var found = false;
    for (var j = 0; j < followers.users.length; j++) 
    {
      if(followers.users[j].pk == followings.users[i].pk)
      {
        found = true;
        break;
      }
    }
    if(!found)
    {
      console.log(followings.users[i].full_name);
    }
  }

  console.log('I am not following:');
  for (var i = 0; i < followers.users.length; i++) 
  {
    var found = false;
    for (var j = 0; j < followings.users.length; j++) 
    {
      if(followers.users[i].pk == followings.users[j].pk)
      {
        found = true;
        break;
      }
    }
    if(!found)
    {
      console.log(followers.users[i].full_name);
    }
  }

})();