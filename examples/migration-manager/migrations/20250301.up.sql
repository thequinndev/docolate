-- BEGIN CHANGESET GROUP [create_table_department] --

/**

Description: Departments table deployment

*/



CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL
);

INSERT INTO TABLE departments (department_id department_name) VALUES (1 'Finance');



-- END CHANGESET GROUP [create_table_department] --

-- BEGIN CHANGESET GROUP [create_table_employees] --

/**

Description: Employees table deployment

*/



CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);



-- END CHANGESET GROUP [create_table_employees] --

-- BEGIN CHANGESET GROUP [create_view_employee_details_v] --

/**

Description: employee_details_v deployment

*/



CREATE OR REPLACE VIEW employee_details_v AS
SELECT e.employee_id, e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;



-- END CHANGESET GROUP [create_view_employee_details_v] --

-- BEGIN CHANGESET GROUP [create_mat_view_employee_details_mv] --

/**

Description: employee_details_mv deployment

*/



CREATE MATERIALIZED VIEW employee_details_mv AS
SELECT e.employee_id, e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;



-- END CHANGESET GROUP [create_mat_view_employee_details_mv] --

-- BEGIN CHANGESET GROUP [create_function_get_employee_details] --

/**

Description: get_employee_details function deployment

*/



CREATE OR REPLACE FUNCTION get_employee_details(emp_id INT)
RETURNS TABLE(employee_id INT, employee_name VARCHAR, department_name VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT e.employee_id, e.employee_name, d.department_name
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    WHERE e.employee_id = emp_id;
END;
$$ LANGUAGE plpgsql;



-- END CHANGESET GROUP [create_function_get_employee_details] --