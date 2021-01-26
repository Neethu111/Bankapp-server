var express = require('express');
const Bank = require('../services/Bank');
var router = express.Router();
var bank = require('../services/Bank')

function authMiddleware(req, res, next) {
  console.log("authMiddleware");
  if (req.session.currentuser) {
    next();
  }
  else {
    res.status(401).send({ message: "user not authenticated" })
    //next({ message: "user not authenticated" })
  }
}


/* GET users listing. */
router.get('/', function (req, res) {
  Bank.getUsers()
  .then(data=>{
    res.status(data.statusCode).send({message:data.message,users:data.users});
  });
});

  //res.send(result);
  //res.send(bank.getUsers());

router.post('/register', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let cpwd = req.body.cpassword;
  let acno = req.body.acno;

  //let data = Bank.getUsers()
  // if (username in data) {
  //   res.status(400).send({ message: "Registration failed  User already exist Please Login" });
  // }
  // else 
  if (password !== cpwd) {
    res.status(400).send({ message: "Password and confirm password doesn't match" });
  }
  else {
    Bank.addUser(username, password, acno)
    //res.send({ message: "Registration Success" });
    .then(data=>{
      res.status(data.statusCode).send({message:data.message});
    })


  }
});
router.post('/login', function (req, res) {
  let uname = req.body.username;
  let pwd = req.body.password;
  Bank.login(uname,pwd)
  .then(data=>{
    if(data.statusCode==200)
    {
      req.session.currentuser = uname;
    }
    res.status(data.statusCode).send({message:data.message});
  })
  // let data = Bank.getUsers()
  // if (uname in data) {
  //   let password = data[uname]["password"]
  //   if (pwd == password) {
  //     //localStorage.setItem("currentuser",uname);
  //     //Bank.setCurrentuser(uname);
  //     req.session.currentuser = uname;
  //     res.send({ message: "Good job! Login Success!" });
  //     //setTimeout(()=>window.location.href="home.html",5000)
  //     //this.props.history.push("/Home")
  //   }
  //   else {
  //     res.status(400).send({ message: "Login failed You provided invalid message" })
  //   }
  // }
  // else {
  //   res.status(400).send({ message: "Invalid login" })
  // }

})

router.post('/Deposit', authMiddleware, function (req, res) {
  let uname = req.body.username;
  let amt = Number(req.body.amount);
  Bank.deposit(uname,amt)
  .then(data=>{
    res.status(data.statusCode).send({message:data.message,balance:data.balance});
  })
  // let data = Bank.getUsers()
  // if (uname in data) {
  //   if (uname != req.session.currentuser) {
  //     return res.send({ message: "Invalid username" })
  //   }
  //   data[uname]["balance"] += amt;
  //   let bal = data[uname]["balance"];
  //   data[uname]["history"].push({
  //     typeOfTransaction: "Credit", amount: amt
  //   })
    // Bank.saveData();

    //alert("avlbal=" + data[uname]["balance"])
    //btag.textContent="Available balance:"+bal;
    //res.send({ balance: bal, message: "Deposit successful" });

    //res.send({ message: "Deposit successful" });
  // }
  // else {
  //   res.status(400).send({ message: "invalid user" });
  // }
});



router.post('/withdraw',authMiddleware, function (req, res) {
  let uname = req.body.username;
  let amt = Number(req.body.amount);
  Bank.withdraw(uname,amt)
  .then(data=>{
    res.status(data.statusCode).send({message:data.message,balance:data.balance});
  })

  // let data = Bank.getUsers();
  // if (uname in data) {
  //   if (uname != req.session.currentuser) {
  //     return res.send({ message: "Invalid username" })
  //   }
  //   if (amt > data[uname]["balance"]) {
  //     return res.send({ message: "Insufficient balance" });
  //   }
  //   data[uname]["balance"] -= amt
  //   let bal = data[uname]["balance"]
  //   data[uname]["history"].push({
  //     typeOfTransaction: "Debit", amount: amt
  //   });
  //   res.send({ balance: bal, message: "withdraw Successful" });
  // }

  // else {
  //   res.status(400).send({ message: "Invalid user" })
  // }
})

router.get('/transactionhistory', authMiddleware, function (req, res) {
 Bank.gethistory(req.session.currentuser)
  
  .then(data=>{
    res.status(data.statusCode).send({history:data.history});
  });
});

// router.delete('/',authMiddleware, function (req, res) {
//   Bank.deleteUser(req.body.username)
//   .then(data=>{
//     res.status(data.statusCode).send({history:data.history});
//   })
// });

// router.delete('/transactionhistory',authMiddleware, function (req, res) {
//   let uname = req.session.currentuser;
//   Bank.history(uname)
//   .then(data=>{
//     res.status(data.statusCode).send({history:data.history});
//   })
// })



// router.get('/user/:id', function (req, res, next) {
//   res.send(req.params.id);
// });
// router.get('/user', function (req, res, next) {
//   res.send(req.query.id);
// });
module.exports = router;
