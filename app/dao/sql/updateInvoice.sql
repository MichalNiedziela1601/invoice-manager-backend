UPDATE invoice SET
invoice_nr = $1,
type = $2,
create_date = $3,
execution_end_date = $4,
netto_value = $5,
brutto_value = $6,
status = $7
WHERE
id = $8;
