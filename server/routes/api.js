const express = require('express')
const router = express.Router()
const data = require('../../expenses')
const moment = require('moment')
const Expense = require('../models/Expense')

// data.forEach(d => {
//     // let date = moment(d.date).format("dddd, MMMM Do YYYY, h:mm:ss a")
//     let expense = new Expense({
//         name: d.item,
//         amount: d.amount,
//         date: d.date,
//         group: d.group
//     })
//     expense.save()
// })

router.get('/expenses', function (req, res) {
    const d1 = req.query.d1 || null
    const d2 = req.query.d2 || null
    if(d1 && d2){
        Expense.find({
            date: {$gte: moment(d1).format("LLLL"),
            $lte: moment(d2).format("LLLL")}
        }).sort({date: -1}).exec(function(err, expenses){
            res.send(expenses)
        })
    }else if(d1){
        Expense.find({ date: {$gte: moment(d1).format("LLLL")}}).sort({date: -1}).exec(function(err, expenses){
            res.send(expenses)
        })
    }else{
        Expense.find({}).sort({date: -1}).exec(function(err, expenses){
            res.send(expenses)
        })
    }
})

router.post('/expense', function(req, res){
    const data = req.body
    const date = data.date ? moment(data.date).format("LLLL") : moment().format("LLLL")
    const expense = new Expense({
        name: data.name,
        amount: data.amount,
        date: date,
        group: data.group
    })
    const promise = expense.save()
    promise.then(function(info){
        console.log(`the amount of the expense is ${data.amount} and what you spent your money on is ${data.name}`);
        res.end()
    })
})

router.put('/update/:group1&:group2', function(req,res){
    const oldGroup = req.params.group1
    const newGroup = req.params.group2
    Expense.findOneAndUpdate({group: oldGroup}, {group: newGroup}, {new: true}, function(err, expense){
        res.send(`expense name is ${expense.name} and its new group is ${expense.group}`)
    })
})

router.get('/expenses/:group', function(req,res){
    const group = req.params.group
    const total = req.query.total
    if(total){
        Expense.aggregate([{$match: {group}}, {$group: {"_id": null, total: {$sum: "$amount"}}}], function(err, sum){
            res.send(sum)
        })
    }else{
        Expense.find({group}, function(err, expenses){
            res.send(expenses)
        })
    }
})

module.exports = router
