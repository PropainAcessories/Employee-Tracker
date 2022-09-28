INSERT INTO department (name)
VALUES ('Software engineering'),
    ('Finance and Accounting'),
    ('Marketing'),
    ('Database Administrator');

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 150000, 1),
    ('Project Manager', 120000, 1),
    ('Junior Developer', 50000, 1),
    ('Senior Developer', 95000, 1),
    ('Accountant', 75000, 2),
    ('Accounting Manager', 120000, 2),
    ('Financial Analyst', 120000, 2),
    ('Sales Manager', 120000, 3),
    ('Sales Rep', 75000, 3),
    ('Public Relations', 75000, 3),
    ('Database Admin.', 75000, 4),
    ('Database Support Technician', 40000, 4);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Davy', 'Jones', 2, NULL),
    ('Edward', 'Teach', 5, 1),
    ('Anne', 'Bonney', 6, NULL),
    ('Thomas', 'Cavendish', 4, 2),
    ('Henry', 'Every', 8, NULL),
    ('Oliver', 'Levasseur', 6, 3);

SELECT * FROM employee;