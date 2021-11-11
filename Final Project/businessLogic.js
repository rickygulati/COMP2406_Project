let users = require("./users.json");
let game = require("./game.json");


/*let users = ["deadman": {
        username: "deadman",
        password: "deadman",
        friends: ["kingslayer", "naxKnight"],
        friendRequests: ["tomatoCultivator"],
        ongoingGames: [101, 102],
        gamesPlayed: 2,
        gamesWon: 1,
        prevMatches: ["win", "loss"],
        accStatus: "public",
        loginStatus: "online"
    },

    {
        username: "kingslayer",
        password: "kingslayer",
        friends: ["naxKnight"],
        friendRequests: ["3mee", "tomatoCultivator", "deadman"],
        ongoingGames: [10, 12],
        gamesPlayed: 2,
        gamesWon: 0,
        prevMatches: ["loss", "loss"],
        accStatus: "public",
        loginStatus: "online"
    },

    {
        username: "3mee",
        password: "3mee1234",
        friends: ["naxKnight", "kingslayer", "tomatoCultivator", ],
        friendRequests: [],
        ongoingGames: [11, 122],
        gamesPlayed: 2,
        gamesWon: 0,
        prevMatches: ["loss", "loss"],
        accStatus: "private",
        loginStatus: "online"
    }
]*/




// function to create a user
function createUser(nUser) {
    if (!nUser.username || !nUser.password) {
        return null;
    }
    for (name in users) {
        let user = users[name];
        if (user.username.localeCompare(nUser.username) == 0) {
            console.log("User already exists!");
            return null;
        }
    }
    /*  if (users.hasOwnProperty(nUser.username)) {
         return null;
     } */

    nUser.friends = [];
    nUser.outgoingRequests = [];
    nUser.friendRequests = [];
    nUser.ongoingGames = [];
    nUser.gamesPlayed = 0;
    nUser.gamesWon = 0;
    nUser.prevMatches = [];
    nUser.accStatus = "public";
    nUser.loginStatus = "online";




    users[nUser.username] = nUser;

    return users[nUser.username];
}


function login(username, password) {

    if (users.hasOwnProperty(username) && users[username].password == password) {
        return users[username];
    } else {
        return null;
    }

}

//function to check if the user exists
function userExists(userObject)

{
    if (!userObject) {
        return false;
    }
    if (!userObject.username || !users.hasOwnProperty(userObject.username)) {
        return false;
    }
    return true;

}


//getting another user's profile
function getOtherUser(requestingUser, userID) {
    if (!userExists(requestingUser)) {
        return null;
    }

    if (users.hasOwnProperty(userID)) {
        if (requestingUser.username === userID || users[userID].accStatus.localeCompare("public") == 0 || (users[userID].accStatus.localeCompare("private") == 0 && users[requestingUser.username].friends.includes(userID))) {
            return users[userID];
        }
    }
    return null;

}


function searchUsers(requestingUser, search) {
    let result = [];

    if (!userExists(requestingUser)) {
        return result;
    }

    for (name in users)

    {
        let user = users[name];

        if (user.username.toLowerCase().indexOf(search) >= 0) {
            if (user.username === requestingUser.username || user.accStatus.localeCompare("public") == 0 || (user.accStatus.localeCompare("private") == 0 && users[requestingUser.username].friends.includes(user.username))) {
                result.push(user);
            }

        }

    }
    return result;
}

function requestFriend(requestingUser, user2) {
    if (!users.hasOwnProperty(requestingUser.username) && !users.hasOwnProperty(user2.username)) {
        return -1;
    }

    if (users[requestingUser.username].friends.includes(user2.username)) {
        return -1;
    }

    //users[user2.username].friendRequests[requestingUser.username] = requestingUser.username;
    users[user2.username].friendRequests.push(requestingUser.username);
    users[requestingUser.username].outgoingRequests.push(user2.username);
    return 0;
}


function addFriend(currUser, userToAdd) {
    //users[currUser.username].friends.push(users[userToAdd.username].username);
    let i = users[currUser.username].friendRequests.indexOf(users[userToAdd.username].username);
    let j = users[userToAdd.username].outgoingRequests.indexOf(users[currUser.username].username);
    if (i != -1 && j != -1) {
        users[currUser.username].friendRequests.splice(i, 1);
        users[userToAdd.username].outgoingRequests.splice(j, 1);
        users[userToAdd.username].friends.push(users[currUser.username].username);
        users[currUser.username].friends.push(users[userToAdd.username].username);
        return 1;
    } else {
        return -1;
    }
}

function rejectFriendRequest(currUser, userToAdd) {
    let i = users[currUser.username].friendRequests.indexOf(users[userToAdd.username].username);
    let j = users[userToAdd.username].outgoingRequests.indexOf(users[currUser.username].username);
    if (i != -1 && j != -1) {
        users[currUser.username].friendRequests.splice(i, 1);
        users[userToAdd.username].outgoingRequests.splice(j, 1);
        return 1;
    } else {
        return -1;
    }
}

function removeFriend(currUser, userToRemove) {
    let i = users[currUser.username].friends.indexOf(users[userToRemove.username].username);
    let j = users[userToRemove.username].friends.indexOf(users[currUser.username].username);
    if (i != -1) {
        users[currUser.username].friends.splice(i, 1);
        users[userToRemove.username].friends.splice(j, 1);
        return 0;
    } else {
        return -1;
    }
}

function setLoginStatus(user) {
    if (users[user.username].loginStatus.localeCompare("online") == 0)
        users[user.username].loginStatus = "offline";
    else
        users[user.username].loginStatus = "online";
}

function setAccountStatus(user) {
    if (users[user.username].accStatus.localeCompare("private") == 0)
        users[user.username].accStatus = "public";
    else
        users[user.username].accStatus = "private";
}


function getActiveGameIDs(user) {
    return users[user.username].ongoingGames;
}



//let a = createUser({ username: "abcd", password: "abcd" });
//let b = createUser({ username: "xyzq", password: "abcd" });

//requestFriend(users["mee"], users["deadman"]);
/* console.log(users["kingslayer"]);
let x = addFriend(users["kingslayer"], users["mee"]);
console.log("x =        " + x);
console.log("after add function??????")
console.log(users["kingslayer"]);
console.log(users["mee"]);
 */
module.exports = {
    users,
    game,
    createUser,
    login,
    userExists,
    getOtherUser,
    searchUsers,
    requestFriend,
    addFriend,
    rejectFriendRequest,
    removeFriend,
    setLoginStatus,
    setAccountStatus,
    getActiveGameIDs
}