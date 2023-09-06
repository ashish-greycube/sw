import frappe
from frappe import _


@frappe.whitelist()
def check_customer_measurement(qtn_reference):
    measurement_documents = frappe.get_list(
        'Customer Measurement',
        filters={'qtn_reference': qtn_reference},
        fields=['name']
    )

    if measurement_documents:
        return measurement_documents[0].name
    else:
        return None
