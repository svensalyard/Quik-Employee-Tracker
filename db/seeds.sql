USE employeetracker_db;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Legal'),
    ('IT'),
    ('Software');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Regional Manager', 400000, 1),
    ('Sales Lead', 80000, 1),
    ('Assitant Regional Manager', 150000, 1),
    ('Managing Attorney', 200000, 2),
    ('Attorney', 160000, 2),
    ('Tech Support Manager', 80000, 3),
    ('Tech Support', 40000, 3),
    ('Lead Developer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Michael', 'Scott', 1, NULL),
    ('Jim', 'Halpert', 2, 1),
    ('Dwight', 'Schrute', 3, 1),
    ('Harvey', 'Spectre', 4, 1),
    ('Michael', 'Ross', 5, 4),
    ('Elliot', 'Alderson', 6, 1),
    ('Nick', 'Quintero', 7, 6),
    ('Steve', 'Jobs', 8, 1);