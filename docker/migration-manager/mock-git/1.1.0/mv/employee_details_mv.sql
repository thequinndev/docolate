CREATE MATERIALIZED VIEW employee_details_mv AS
SELECT e.employee_id, e.employee_name, e.salary, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;