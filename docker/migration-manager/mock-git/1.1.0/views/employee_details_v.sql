CREATE OR REPLACE VIEW employee_details_v AS
SELECT e.employee_id, e.employee_name, d.department_name, d.location
FROM employees e
JOIN departments d ON e.department_id = d.department_id;
