import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def execute():
    print("creating sales_order_item_cf in POI...")
    custom_fields = {
        "Purchase Order Item": [
            dict(
                fieldname="sales_order_item_cf",
                label="Sales Order Item CF",
                fieldtype="Data",
                insert_after="sales_order_item",
                translatable=0
            ),    
        ]   
    }

    create_custom_fields(custom_fields, update=True)