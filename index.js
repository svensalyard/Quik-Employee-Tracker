require("dotenv").config();

const path = require("path");
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

// Greets user with a logo
function logo() {
	console.log(" _______                  __                               _______                   __               ");
	console.log("|    ___|.--------.-----.|  |.-----.--.--.-----.-----.    |_     _|.----.---.-.----.|  |--.-----.----.");
	console.log("|    ___||        |  _  ||  ||  _  |  |  |  -__|  -__|      |   |  |   _|  _  |  __||    <|  -__|   _|");
	console.log("|_______||__|__|__|   __||__||_____|___  |_____|_____|      |___|  |__| |___._|____||__|__|_____|__|  ");
	console.log("                  |__|             |_____|                                                            ");
	start();
}

// initial app call
logo();

// begins after logo to first query the user with inquirer on what they want to do
function start() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Please select one.",
				name: "options",
				choices: [
					{
						name: "View All Employees",
						value: "view-all-employees",
					},
					{
						name: "Add Employee",
						value: "add-employee",
					},
					{
						name: "Update Employee Role",
						value: "update-employee-role",
					},
					{
						name: "View All Roles",
						value: "view-all-roles",
					},
					{
						name: "Add Role",
						value: "add-role",
					},
					{
						name: "View All Deparments",
						value: "view-all-departments",
					},
					{
						name: "Add A Department",
						value: "add-department",
					},
				],
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

// Find all employees
async function selectEmployees() {
	return connection
		.promise()
		.query(
			`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
	FROM employee
	JOIN role ON role.id = employee.role_id
	JOIN department ON department.id = role.department_id
	JOIN employee manager ON employee.manager_id = manager.id;`
		)
		.then(([rows]) => {
			console.table(rows);
		})
		.then(() => start())
		.catch((error) => console.log(error));
}

// Find All Roles
async function selectRoles() {
	return connection
		.promise()
		.query(
			`SELECT role.id, role.title, role.salary, department.name AS department 
	FROM role 
	JOIN department ON department.id = role.department_id;`
		)
		.then(([rows]) => {
			let data = rows;
			console.table(data);
		})
		.then(() => start())
		.catch((error) => console.log(error));
}

// Find All Departments
async function selectDepartments() {
	return connection
		.promise()
		.query("SELECT * FROM department;")
		.then(([rows]) => {
			let data = rows;
			console.table(data);
		})
		.then(() => start())
		.catch((error) => console.log(error));
}

// Add a New Employee
async function newEmployee() {
	return connection
		.promise()
		.query(
			`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, department.name AS department, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name, manager.id AS manager_id
	FROM employee
	JOIN role ON role.id = employee.role_id
	JOIN department ON department.id = role.department_id
	JOIN employee manager ON employee.manager_id = manager.id;`
		)
		.then(([rows]) => {
			console.table(rows);})
			.then(() =>
					inquirer
				.prompt([
					{
						type: "input",
						name: "firstname",
						message: "What is the first name of the employee?",
					},
					{
						type: "input",
						name: "lastname",
						message: "What is the last name of the employee?",
					},
					{
						type: "input",
						name: "roleid",
						message: "What is the id of this employees role?",
					},
					{
						type: "input",
						name: "managerid",
						message: "What is the id of this employees manager?",
					},
				]))
				.then((res) => {
					let employee = {
						first_name: res.firstname,
						last_name: res.lastname,
						role_id: res.roleid,
						manager_id: res.managerid,
					};
					return connection
						.promise()
						.query("INSERT INTO employee SET ?", employee)
						.then(([rows]) => {
							let data = rows;
							console.table(data);
						})
						.then(() => start())
						.catch((error) => console.log(error));
						});};

// Add a new role
async function addRole() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "title",
				message: "What is the role?",
			},
			{
				type: "input",
				name: "salary",
				message: "What is the salary for this role?",
			},
		])
		.then((res) => {
			let title = res.title;
			let salary = res.salary;
			return connection
				.promise()
				.query("SELECT * FROM department;")
				.then(([rows]) => {
					let data = rows;
					const allchoices = data.map(({ id, name }) => ({ name: name, value: id }));

					inquirer
						.prompt([
							{
								type: "list",
								name: "department_id",
								message: "What department is this role going to be a part of?",
								choices: allchoices,
							},
						])
						.then((res) => {
							let department_id = res.department_id;
							return connection
								.promise()
								.query(`INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${department_id})`)
								.then(() => {
									console.log(`Added role ${title}.`);
								})
								.then(() => start())
								.catch((error) => console.log(error));
						});
				});
		});
}

// Add a new department
async function addDepartment() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message: "What is the department name?",
			},
		])
		.then((res) => {
			let department = res.name;
			return connection
				.promise()
				.query(`INSERT INTO department (name) VALUES ('${department}')`)
				.then(() => {
					console.log(`Added department ${department}.`);
				})
				.then(() => start())
				.catch((error) => console.log(error));
		});
}

// Update a role
async function updateRole() {
	return connection
		.promise()
		.query(
			`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, department.name AS department, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name, manager.id AS manager_id
	FROM employee
	JOIN role ON role.id = employee.role_id
	JOIN department ON department.id = role.department_id
	JOIN employee manager ON employee.manager_id = manager.id;`
		)
		.then(([rows]) => {
			console.table(rows);})
			.then(() =>
					inquirer
				.prompt([
					{
						type: "input",
						name: "employeeid",
						message: "What is the id of the employee?",
					},
					{
						type: "input",
						name: "roleid",
						message: "What is the id of this employees new role?",
					}
				]))
				.then((res) => {
					let role_id = res.roleid; let employee_id = res.employeeid;
					return connection.promise().query(
						"UPDATE employee SET role_id = ? WHERE id = ?", [role_id, employee_id])			
						.then(([rows]) => {
							console.table(rows);
						})
						.then(() => start())
						.catch((error) => console.log(error));
						});};
