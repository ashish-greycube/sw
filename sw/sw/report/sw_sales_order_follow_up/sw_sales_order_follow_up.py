# Copyright (c) 2023, GreyCube Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import add_months, nowdate
from frappe.utils import getdate
from frappe.utils import flt,add_days,cint


def execute(filters=None):
	if not filters:
		filters = {}
	columns = get_columns(filters)
	data = get_entries(filters)
	return columns, data

def get_columns(filters):
	columns = [
        {
            "label": _("SO No"),
            "fieldtype": "Link",
            "fieldname": "so_no",
            "options": "Sales Order",
            "width": 200,
        },
        {
            "label": _("SO Date"),
            "fieldtype": "Date",
            "fieldname": "so_date",
            "width": 100,
        },        
        {
            "label": _("Item Name"),
            "fieldtype": "Link",
            "fieldname": "item_name",
            "options": "Item",
            "width": 130,
        },
        {
            "label": _("Customer Name"),
            "fieldtype": "Link",
            "fieldname": "customer_name",
            "options": "Customer",
            "width": 100,
        },
		{
            "label": _("Phone No"),
            "fieldtype": "Data",
            "fieldname": "phone_no",
            "width": 100,
        },
		{
            "label": _("SO Qty"),
            "fieldtype": "Float",
            "fieldname": "so_qty",
            "width": 100,
        },
		{
            "label": _("PO Created"),
            "fieldtype": "Data",
            "fieldname": "po_created",
            "width": 100,
        },
        {
            "label": _("PO No"),
            "fieldtype": "Link",
            "fieldname": "po_no",
            "options": "Purchase Order",
            "width": 200,
        },
		{
            "label": _("Material Receiving"),
            "fieldtype": "Data",
            "fieldname": "material_receiving",
            "width": 100,
        },
		{
            "label": _("Produced Qty"),
            "fieldtype": "Data",
            "fieldname": "produced_qty",
            "width": 100,
        },
		{
            "label": _("Under Process Qty"),
            "fieldtype": "Data",
            "fieldname": "under_process_qty",
            "width": 100,
        },
		{
            "label": _("Delivered Qty"),
            "fieldtype": "Float",
            "fieldname": "delivered_qty",
            "width": 100,
        },
		{
            "label": _("To Deliver Qty"),
            "fieldtype": "Float",
            "fieldname": "to_deliver_qty",
            "width": 100,
        },
	]
	return columns

def get_entries(filters):
    conditions = get_conditions(filters)
    query = """
       SELECT
            so.name AS so_no, so.transaction_date AS so_date, so.customer AS customer_name, soi.item_name AS item_name, cus.phone_no AS phone_no, soi.qty AS so_qty,
            IF(poi.parent IS NOT NULL, 'Yes', 'No') AS po_created, poi.parent AS po_no,
            CASE
                WHEN sum(poi.stock_qty) != sum(poi.received_qty) AND sum(poi.received_qty) = 0 THEN 'No'
                WHEN sum(poi.stock_qty) = sum(poi.received_qty) THEN 'Yes'
                WHEN sum(poi.stock_qty) != sum(poi.received_qty) AND sum(poi.received_qty) != 0 THEN 'Partial'
                ELSE ''
            END AS material_receiving,
            sum(wo.produced_qty) AS produced_qty, (sum(wo.qty) - sum(wo.produced_qty)) AS under_process_qty, soi.delivered_qty AS delivered_qty,(soi.qty - soi.delivered_qty) AS to_deliver_qty
        FROM
            `tabSales Order` so
        INNER JOIN
            `tabSales Order Item` soi ON so.name = soi.parent
        INNER JOIN
            `tabCustomer` cus ON so.customer = cus.name
        LEFT JOIN
            `tabWork Order` wo ON so.name = wo.sales_order
        LEFT JOIN
            `tabPurchase Order Item` poi ON soi.name = poi.sales_order_item
    
        WHERE

            1=1
            {0}
        group by soi.name
        """.format(conditions)

    entries = frappe.db.sql(query, filters, as_dict=True,debug=True)
    return entries

def get_conditions(filters):
    # conditions = ""
    conditions = " AND so.docstatus = 1"

    if filters.get("from_date"):
        conditions += " and so.transaction_date >= %(from_date)s"
    if filters.get("to_date"):
        conditions += " and so.transaction_date <= %(to_date)s"
    if filters.get("customer_name"):
        conditions += " and so.customer = %(customer_name)s"
    if filters.get("so_no"):
        conditions += " and so.name = %(so_no)s"
    return conditions