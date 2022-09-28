require('dotenv').config();
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const db = require('./config/connection');
const cTable = require('console.table');
const { response } = require('express');

const PORT = process.env.PORT;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default not found response.
app.use((req, res) => {
    res.status(404).end();
});

// Start sever after connecting to Database.
db.connect(err => {
    if (err) throw err;
    app.listen(PORT, () => {});
});

// Inquirer questions
 startPrompt = () => {
    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What do you want to do?',
        choices: [
            'View Departments', 'View Roles', 'View Employees',
            'Add Department', 'Add Role', 'Add Employee', 
            'Update Employee', 'Update Manager','Delete Department',
            'Delete Role', 'Delete Employee'
        ],
    }).then(response => {
        switch (response.menu) {
            case 'View Departments':
                viewDepartments();
                break;
            case 'View Roles':
                viewRoles();
                break;
            case 'View Employees':
                viewEmployees();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'Update Manager':
                updateManager();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Role':
                deleteRole();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
        };
    })
};

viewDepartments = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
    });
};

viewRoles = () => {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return;
        }
        console.table(result);
        startPrompt();
    })
};

viewEmployees = () => {
    const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                role.title AS job_title,
                department.name,
                role.salary,
                CONCAT(manager.first_name, '  ' , manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
                ORDER by employee.id`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        startPrompt();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            name: 'department_name',
            type: 'input',
            message: 'Please enter the name of the department you want to add'
        }
    ]).then((answer) => {
        const sql = `INSERT INTO department (name)
                    VALUES(?)`;
        const params = [answer.department_name];
        db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Department Added');

            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    return;
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'enter the name of the role you wish to add'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary this job pays; no dots spaces or commas.'
        },
        {
            name: 'department_id',
            type: 'number',
            message: 'Enter the department ID number for this role.'
        }
    ]).then((response)=> {
        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",[response.title, response.salary, response.department_id], (err, data) => {
            if (err) throw (err);
            console.log('New Role Added');
            
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Please enter the first name of the Employee you are adding'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'Please enter the last name of the Employee you are adding'
        },
        {
            name: 'role_id',
            type: 'number',
            message: 'Please enter the role id number for the employee.'
        },
        {
            name: 'manager_id',
            type: 'number',
            message: 'Please enter Manager ID number associated with the database'
        }
    ]).then((response) => {
        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", [response.first_name, response.last_name, response.role_id, response.manager_id], (err, data) =>{
            if (err) throw err;
            console.table('New employee added.');

            db.query(`SELECT * FROM employee`, (err, result) =>{
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

updateEmployee = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'please enter the first name of the employee you want to update.'
        },
        {
            name: 'role_id',
            type: "number",
            message:'enter the role ID number associated with the employee.'
        }
    ]).then((response) => {
        db.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.first_name], (err, data) => {
            if (err) {
                res.status(500).json({ error: err.message })
                startPrompt();
            }
            console.table(response);
            startPrompt();
        });
    });
};

updateManager = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'Please enter the first name of the employee you are updating.'
        },
        {
            name: 'manager_id',
            type: 'number',
            message: 'Enter the manager id number for the employee'
        }
    ]).then((response) => {
        db.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [response.manager_id, response.first_name], (err,data) => {
            if (err) throw err;
            console.log("new manager id entered.");

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            })
        });
    });
};

deleteDepartment = () => {
    inquirer.prompt([
        {
            name: 'department_id',
            type: 'number',
            message: 'Enter the department ID number you are removing'
        }
    ]).then((response) => {
        db.query("DELETE FROM department WHERE id = ?", [response.department_id], (err, data) => {
            if (err) throw err;
            console.log("Role removed.");
            
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message})
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

deleteRole = () => {
    inquirer.prompt([
        {
            name: 'role_id',
            type: 'number',
            message: 'enter the role ID number you want to remove'
        }
    ]).then((response) => {
        db.query("DELETE FROM role WHERE ID = ?", [response.role_id], (err, data)=> {
            if (err) throw err;
            console.log('Role removed');

            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

deleteEmployee = () => {
    inquirer.prompt([
        {
            name: 'employee_id',
            type: 'number',
            message: 'Enter the employee ID number you wish to remove'
        }
    ]).then((response)=> {
        db.query("DELETE FROM employee WHERE id = ?", [response.employee_id], (err, data)=> {
            if (err) throw err;
            console.log("employee removed");

            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) {
                    res.status(500).json({ error: err.message })
                    startPrompt();
                }
                console.table(result);
                startPrompt();
            });
        });
    });
};

// Call to start app
startPrompt();
