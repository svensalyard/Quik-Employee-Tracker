require('dotenv').config();

const path = require('path')
const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection(
	{
		host: "localhost",
		// MySQL username,
		user: "root",
		// MySQL password
		password: process.env.DB_PASSWORD,
		database: "employeetracker_db",
	},
	console.log(`Connected to the employeetracker_db database.`)
);

function logo() {
	console.log(' _______                  __                               _______                   __               ');
	console.log('|    ___|.--------.-----.|  |.-----.--.--.-----.-----.    |_     _|.----.---.-.----.|  |--.-----.----.');
	console.log('|    ___||        |  _  ||  ||  _  |  |  |  -__|  -__|      |   |  |   _|  _  |  __||    <|  -__|   _|');
	console.log('|_______||__|__|__|   __||__||_____|___  |_____|_____|      |___|  |__| |___._|____||__|__|_____|__|  ');
	console.log('                  |__|             |_____|                                                            ');
	start();
};

logo();

function start() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Please select one.",
				name: "options",
				  choices: [
				  {
				    name: 'View All Employees',
				    value: 'view-all-employees'
				  },
				  {
				    name: 'Add Employee',
				    value: 'add-employee'
				  },
				  {
				      name: 'Update Employee Role',
				      value: 'update-employee-role'
				  },
				  {
				    name: 'View All Roles',
				    value: 'view-all-roles'
				  },
				  {
				    name: 'Add Role',
				    value:'add-role'
				  },
				  {
				    name: 'View All Deparments',
				    value:'view-all-departments'
				  },
				  {
				    name: 'Add A Department',
				    value: 'add-department'
				  }
				]
			},
		])
		.then((answers) => {
			console.log(answers);
			switch (answers.options) {
				case "view-all-employees":
					selectEmployees();
					break;
				case "add-employee":
					newEmployee();
					break;
				case "update-employee-role":
					updateRole();
					break;
				case "view-all-roles":
					selectRoles();
					break;
				case "add-role":
					addRole();
					break;
				case "view-all-departments":
					selectDepartments();
					break;
				case "add-department":
					addDepartment();
					break;
			}
		})
		.catch((error) => {
			console.log(error);
		});
}