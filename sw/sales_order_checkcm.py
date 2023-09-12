import frappe
from frappe import _

    
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
