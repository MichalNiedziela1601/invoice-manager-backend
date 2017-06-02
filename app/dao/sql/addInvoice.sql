INSERT INTO invoice (invoice_nr, type, create_date, execution_end_date, netto_value,
            brutto_value, status, url, company_dealer, company_recipent, person_dealer, person_recipent,
             google_year_folder_id, google_month_folder_id,year,month,number,products,description,payment_method, advance, file_id, currency, language,
             reverse_charge)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22, $23, $24, $25) RETURNING id
