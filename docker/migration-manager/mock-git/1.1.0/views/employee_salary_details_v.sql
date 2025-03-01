CREATE OR REPLACE VIEW employee_salary_details_v AS
SELECT e.employee_id, e.employee_name, e.salary, d.department_name, d.location
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE e.salary > 50000;