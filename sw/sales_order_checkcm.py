import frappe
from frappe import _


@frappe.whitelist()
def check_customer_measurement(qtn_reference_cf):
    measurement_documents = frappe.get_list(
        'Customer Measurement',
        filters={'qtn_reference_cf': qtn_reference_cf},
        fields=['name']
    )
    if measurement_documents:
        return measurement_documents[0].name
    else:
        return None
    
@frappe.whitelist()
def update_customer_measurement(cm_docname, so_reference_cf):
    doc = frappe.get_doc('Customer Measurement', cm_docname)
    if doc:
        if doc.so_reference_cf==None:
            doc.so_reference_cf = so_reference_cf
            doc.save(ignore_permissions=True)
            return True
    else:
        frappe.msgprint(_('Customer Measurement document not found for updating so_reference.'))
        return False
