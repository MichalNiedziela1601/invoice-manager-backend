INSERT INTO invoice (invoice_nr, type, create_date, execution_end_date, netto_value,
            brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
