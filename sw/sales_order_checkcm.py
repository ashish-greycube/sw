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
    
@frappe.whitelist()
def update_customer_measurement(cm_docname, so_reference):
    doc = frappe.get_doc('Customer Measurement', cm_docname)
    if doc:
        doc.so_reference = so_reference
        doc.save(ignore_permissions=True)
        return True
    else:
        frappe.msgprint(_('Customer Measurement document not found for updating so_reference.'))
        return False
