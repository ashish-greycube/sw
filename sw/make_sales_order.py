import frappe
from frappe import _
from frappe.model.mapper import get_mapped_doc
from frappe.utils import flt, getdate, nowdate,today
import datetime

@frappe.whitelist()
def make_sales_order(source_name, target_doc=None):
    def set_missing_values(source, target):
        for sales_order_item in source.get('items'):
            so_item = sales_order_item.item_code
            item_bom = frappe.db.get_value('Item',so_item,'default_bom')
            if item_bom:
                bom_doc = frappe.get_doc('BOM', item_bom)
                for bom_item in bom_doc.items:
                    bom_item_code = bom_item.item_code
                    bom_item_qty = bom_item.qty
                    po_qty = (bom_item_qty)*(sales_order_item.qty)
                    target.append('items',{
                        'item_code':bom_item_code,
                        'item_name':bom_item.item_name,
                        'qty':po_qty,
                        'uom':bom_item.uom,
                        'stock_uom':bom_item.stock_uom,
                        'conversion_factor':bom_item.conversion_factor,
                        'schedule_date':today(),
                        'sales_order':source.name,
                        # 'sales_order_item':sales_order_item.name
                        'sales_order_item_cf':sales_order_item.name
                    })
            else:
                for sales_order_item in source.get('items'):
                    target.append('items',{
                    'item_code':sales_order_item.item_code,
                    'item_name':sales_order_item.item_name,
                    'qty':sales_order_item.qty,
                    'uom':sales_order_item.uom,
                    'stock_uom':sales_order_item.stock_uom,
                    'conversion_factor':sales_order_item.conversion_factor,
                    'schedule_date':today(),
                    'sales_order':source.name,
                    'sales_order_item_cf':sales_order_item.name
                    # 'sales_order_item':sales_order_item.name
                })
        target.run_method("set_missing_values")
        target.run_method("get_schedule_dates")
        target.run_method("calculate_taxes_and_totals")
        target.inter_company_order_reference=None

    doclist = get_mapped_doc(
        "Sales Order",
        source_name,
        {
            "Sales Order": {
                "doctype": "Purchase Order",
                "validation": {
                    "docstatus": ["=", 1],
                },
            },
            "Purchase Taxes and Charges": {
                "doctype": "Purchase Taxes and Charges",
            },
        },
        target_doc,
        set_missing_values,
    )
   
    # doclist.set_onload("ignore_price_list", True)
    return doclist
