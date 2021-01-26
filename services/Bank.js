const { User } = require('../models/user');
let data = {
    // neethu: { username: "neethu", password: "neethu", acno: "1001", balance: 50000, history: [] },
    // test1: { username: "test1", password: "test1", acno: "1002", balance: 40000, history: [] },
    // tes2: { username: "test2", password: "test2", acno: "1003", balance: 60000, history: [] },
    // test3: { username: "test3", password: "test3", acno: "1004", balance: 70000, history: [] },
}
let currentuser;
function addUser(username, password, acno) {
    //data[username] = { username, password, acno, history:[] ,balance: 0 }
    return User.findOne({
        username
    })
        .then(user => {
            if (user) {
                return {
                    statusCode: 400,
                    message: "Account already exists"
                }
            }
            const newUser = new User({
                username, password, acno, history: [], balance: 0
            });
            newUser.save();
            return {
                statusCode: 200,
                message: "Account created successfully"
            }

        })

}

function login(username, password) {
    return User.findOne({
        username,
        password
    })

        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    message: "Logged successfully"
                };
            }
            return {
                statusCode: 400,
                message: "Invalid credentials"
            };
        })
}

function deposit(username, amount) {
    return User.findOne({
        username,

    })
        .then(user => {
            if (user) {
                user.balance += amount;
                let bal = user.balance;
                user.history.push({
                    typeOfTransaction: "Credit", amount: amount
                })
                user.save();
                return { statusCode: 200, balance: bal, message: "Deposit successful" };
            }
            return {
                statusCode: 400,
                message: "Invalid details"
            };
        })
}

function withdraw(username, amount) {
    return User.findOne({
        username,

    })
        .then(user => {
            if (user) {
                if (amount > user.balance) {
                    return { statusCode: 400, balance: user.balance, message: "Insufficient balance" };
                }
                user.balance -= amount;
                let bal = user.balance;
                user.history.push({
                    typeOfTransaction: "Dedit", amount: amount
                })
                user.save();
                return { statusCode: 200, balance: bal, message: "Withdraw successful" };
            }
            return {
                statusCode: 400,
                message: "Invalid details"
            };
        })
}

function setCurrentuser(username) {
    //localStorage.setItem("currentuser",uname);
    //Bank.currentuser=uname;
    currentuser = username;
}
function getCurrentuser(username) {
    //localStorage.setItem("currentuser",uname);
    //Bank.currentuser=uname;
    return currentuser;
}

function getUsers() {
    //return data;
    return User.find({}).select("username history")
        .then(users => {
            return {
                statusCode: 200,
                users: users
            }
        })
}
function gethistory(username) {
    return User.findOne({
        username,

    })
        .then(user => {

            return {
                statusCode: 200,
                history: user.history,
            }

        });
}

// function deleteUser(username) {
//     return User.deleteOne{
//         (
//             username,
//         )
//     }

//     .then(data => {
//         return { statusCode: 200, message: "User deletion successfull" };
//     })

// }


// module.exports={
//     getUsers:()=>{
//         return data;
//     }

// }
module.exports = {
    getUsers,
    addUser,
    // setCurrentuser: setCurrentuser,
    // getCurrentuser: getCurrentuser,
    login,
    deposit,
    withdraw,
    gethistory

}
