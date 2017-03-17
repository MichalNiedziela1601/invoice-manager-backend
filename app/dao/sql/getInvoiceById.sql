SELECT i.id, i.invoice_nr, i.type, i.create_date, i.execution_end_date, i.netto_value, i.brutto_value, i.status, i.url,
        cd.id AS dealer_id, cd.name AS dealer_name, cd.nip AS delaer_nip, cd.regon AS dealer_regon, ad.street AS dealer_street,
        ad.build_nr AS dealer_build_nr, ad.flat_nr AS dealer_flat_nr, ad.post_code AS dealer_post_code, ad.city AS dealer_city,
        cr.id AS recipent_id, cr.name AS recipent_name, cr.nip AS recipent_nip, cr.regon AS recipent_regon, ar.street AS recipent_street,
        ar.build_nr AS recipent_build_nr, ar.flat_nr AS recipent_falt_nr, ar.post_code AS recipent_post_code, ar.city AS recipent_city
        FROM invoice AS i LEFT JOIN company AS cd ON i.company_dealer = cd.id LEFT JOIN company AS cr ON i.company_recipent = cr.id
        LEFT JOIN address AS ad ON cd.address_id = ad.id LEFT JOIN address AS ar ON cr.address_id = ar.id WHERE i.id = $1;
