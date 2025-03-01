-- BEGIN CHANGESET GROUP [create_function_get_employee_details] --

/**

Description: get_employee_details function deployment

*/



DROP FUNCTION get_employee_details(emp_id INT);



-- END CHANGESET GROUP [create_function_get_employee_details] --

-- BEGIN CHANGESET GROUP [create_mat_view_employee_details_mv] --

/**

Description: employee_details_mv deployment

*/



DROP MATERIALIZED VIEW employee_details_mv;



-- END CHANGESET GROUP [create_mat_view_employee_details_mv] --

-- BEGIN CHANGESET GROUP [create_view_employee_details_v] --

/**

Description: employee_details_v deployment

*/



DROP VIEW employee_details_v;



-- END CHANGESET GROUP [create_view_employee_details_v] --

-- BEGIN CHANGESET GROUP [create_table_employees] --

/**

Description: Employees table deployment

*/



DROP TABLE employees;



-- END CHANGESET GROUP [create_table_employees] --

-- BEGIN CHANGESET GROUP [create_table_department] --

/**

Description: Departments table deployment

*/



DELETE FROM departments WHERE department_id = 1;

DROP TABLE departments;



-- END CHANGESET GROUP [create_table_department] --