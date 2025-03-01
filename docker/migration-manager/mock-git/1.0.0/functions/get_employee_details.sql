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
