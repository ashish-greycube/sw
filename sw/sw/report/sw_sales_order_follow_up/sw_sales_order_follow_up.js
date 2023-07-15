frappe.query_reports["SW Sales Order Follow Up"] = {
    "filters": [
        {
            "fieldname": "customer_name",
            "label": "Customer Name",
            "fieldtype": "Link",
            "options": "Customer"
        },
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date",
            "default":frappe.datetime.add_months(frappe.datetime.month_start(), -1)
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date",
            "default": frappe.datetime.get_today()
        },
        {
            "fieldname": "so_no",
            "label": "SO No",
            "fieldtype": "Link",
            "options": "Sales Order"
        }
    ]
};