const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const FILE = "./expenses.json";

// GET all expenses
app.get("/expenses", (req, res) => {

    const data = JSON.parse(
        fs.readFileSync(FILE)
    );

    res.json(data);
});

// ADD expense
app.post("/expenses", (req, res) => {

    const expenses = JSON.parse(
        fs.readFileSync(FILE)
    );

    const newExpense = {
        id: Date.now(),
        ...req.body
    };

    expenses.push(newExpense);

    fs.writeFileSync(
        FILE,
        JSON.stringify(expenses, null, 2)
    );

    res.json(newExpense);
});
app.delete("/expenses/:id", (req, res) => {

    let expenses = JSON.parse(
        fs.readFileSync(FILE)
    );

    expenses = expenses.filter(
        expense => expense.id != req.params.id
    );

    fs.writeFileSync(
        FILE,
        JSON.stringify(expenses, null, 2)
    );

    res.json({
        message: "Deleted"
    });
});

app.put("/expenses/:id", (req, res) => {

    const expenses = JSON.parse(
        fs.readFileSync(FILE)
    );

    const updatedExpenses = expenses.map(expense =>

        expense.id == req.params.id

            ? {
                ...expense,
                ...req.body
            }

            : expense
    );

    fs.writeFileSync(
        FILE,
        JSON.stringify(updatedExpenses, null, 2)
    );

    res.json({
        message: "Updated"
    });
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});