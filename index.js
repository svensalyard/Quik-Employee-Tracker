const path = require('path')
const inquirer = require("inquirer");
const mysql = require("mysql2");

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