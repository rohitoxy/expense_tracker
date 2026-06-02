let editingId = null;
let categoryChart = null;
let monthlyChart = null;

const form = document.getElementById("expenseForm");

document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const expense = {
        title: document.getElementById("title").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value,
        note: document.getElementById("note").value
    };

    if (editingId) {

        await fetch(`/expenses/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        editingId = null;

    } else {

        await fetch("/expenses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });
    }

    form.reset();

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    loadExpenses();
});

async function loadExpenses() {

    const response = await fetch("/expenses");

    const expenses = await response.json();

    const searchTitle =
        document.getElementById("searchTitle")?.value.toLowerCase() || "";

    const filterCategory =
        document.getElementById("filterCategory")?.value || "";

    const fromDate =
        document.getElementById("fromDate")?.value || "";

    const toDate =
        document.getElementById("toDate")?.value || "";

    if (
        fromDate &&
        toDate &&
        fromDate > toDate
    ) {
        alert("From Date cannot be after To Date");
        return;
    }

    const filteredExpenses =
        expenses.filter(expense => {

            const titleMatch =
                expense.title
                    .toLowerCase()
                    .includes(searchTitle);

            const categoryMatch =
                !filterCategory ||
                expense.category === filterCategory;

            const fromMatch =
                !fromDate ||
                expense.date >= fromDate;

            const toMatch =
                !toDate ||
                expense.date <= toDate;

            return (
                titleMatch &&
                categoryMatch &&
                fromMatch &&
                toMatch
            );
        });

    renderSummary(filteredExpenses);

    updateDashboard(
        filteredExpenses
    );

    renderCharts(
        filteredExpenses
    );

    filteredExpenses.sort(
        (a, b) =>
            new Date(b.date) -
            new Date(a.date)
    );

    const table =
        document.getElementById("expenseList");

    table.innerHTML = "";

    if (filteredExpenses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No expenses found
                </td>
            </tr>
        `;

        return;
    }

    filteredExpenses.forEach(expense => {

        table.innerHTML += `
            <tr>
                <td>${expense.title}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>${expense.note || ""}</td>
                <td>
                    <button onclick="editExpense(${expense.id})">
                        Edit
                    </button>

                    <button onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function deleteExpense(id) {

    const confirmDelete =
        confirm("Delete this expense?");

    if (!confirmDelete) return;

    await fetch(`/expenses/${id}`, {
        method: "DELETE"
    });

    loadExpenses();
}

function editExpense(id) {

    fetch("/expenses")
        .then(res => res.json())
        .then(expenses => {

            const expense =
                expenses.find(
                    e => e.id === id
                );

            editingId = id;

            document.getElementById("title").value =
                expense.title;

            document.getElementById("amount").value =
                expense.amount;

            document.getElementById("category").value =
                expense.category;

            document.getElementById("date").value =
                expense.date;

            document.getElementById("note").value =
                expense.note;
        });
}

function renderSummary(expenses) {

    const currentMonth =
        new Date().getMonth();

    const currentYear =
        new Date().getFullYear();

    const monthlyExpenses =
        expenses.filter(expense => {

            const date =
                new Date(expense.date);

            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        });

    const totalSpent =
        monthlyExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );

    const categoryTotals = {};

    monthlyExpenses.forEach(expense => {

        categoryTotals[
            expense.category
        ] =
            (categoryTotals[
                expense.category
            ] || 0)
            +
            Number(expense.amount);
    });

    let html =
        `<h3>Total Spent: ₹${totalSpent}</h3>`;

    html += "<ul>";

    for (let category in categoryTotals) {

        html += `
            <li>
                ${category}: ₹${categoryTotals[category]}
            </li>
        `;
    }

    html += "</ul>";

    document.getElementById("summary")
        .innerHTML = html;
}
function updateDashboard(expenses) {

    const total = expenses.reduce(
        (sum, expense) =>
            sum + Number(expense.amount),
        0
    );

    document.getElementById(
        "totalExpense"
    ).textContent = `₹${total}`;

    document.getElementById(
        "totalTransactions"
    ).textContent =
        expenses.length;

    const categoryTotals = {};

    expenses.forEach(expense => {

        categoryTotals[
            expense.category
        ] =
            (categoryTotals[
                expense.category
            ] || 0)
            +
            Number(expense.amount);
    });

    let topCategory = "-";
    let maxAmount = 0;

    for (let category in categoryTotals) {

        if (
            categoryTotals[category]
            > maxAmount
        ) {

            maxAmount =
                categoryTotals[category];

            topCategory =
                category;
        }
    }

    document.getElementById(
        "topCategory"
    ).textContent =
        topCategory;
}

function renderCharts(expenses) {

    const categoryTotals = {};

    expenses.forEach(expense => {

        categoryTotals[
            expense.category
        ] =
            (categoryTotals[
                expense.category
            ] || 0)
            +
            Number(expense.amount);
    });

    const labels =
        Object.keys(categoryTotals);

    const values =
        Object.values(categoryTotals);

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart =
        new Chart(
            document.getElementById(
                "categoryChart"
            ),
            {
                type: "doughnut",

                data: {
                    labels: labels,

                    datasets: [{
                        data: values,

                        backgroundColor: [
                            "#8b5cf6",
                            "#06b6d4",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#ec4899"
                        ]
                    }]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        );

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart =
        new Chart(
            document.getElementById(
                "monthlyChart"
            ),
            {
                type: "bar",

                data: {
                    labels: labels,

                    datasets: [{
                        label:
                            "Amount Spent",

                        data: values,

                        backgroundColor:
                            "#8b5cf6"
                    }]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            labels: {
                                color: "white"
                            }
                        }
                    },

                    scales: {

                        x: {
                            ticks: {
                                color: "white"
                            }
                        },

                        y: {
                            ticks: {
                                color: "white"
                            }
                        }
                    }
                }
            }
        );
}

loadExpenses();