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
            "width": 170,
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
            "width": 220,
        },
        {
            "label": _("Customer Name"),
            "fieldtype": "Link",
            "fieldname": "customer_name",
            "options": "Customer",
            "width": 200,
        },
		{
            "label": _("Phone No"),
            "fieldtype": "Data",
            "fieldname": "phone_no",
            "width": 120,
        },
		{
            "label": _("SO Qty"),
            "fieldtype": "Float",
            "fieldname": "so_qty",
            "width": 70,
        },
		{
            "label": _("PO Created"),
            "fieldtype": "Data",
            "fieldname": "po_created",
            "width": 80,
        },
        {
            "label": _("PO No"),
            "fieldtype": "Link",
            "fieldname": "po_no",
            "options": "Purchase Order",
            "width": 170,
        },
		{
            "label": _("Material Received"),
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
    # To create multiple PO for same SO, and to remove erpnext's standard validations, need to create sales_order_item_cf custom field to store hex code of SO item name in PO item. By this way, we can fetch BOM item for SO item in PO item table without any validations of more qty of SO.

    query = """
       SELECT
            so.name AS so_no, so.transaction_date AS so_date, so.customer AS customer_name, soi.item_name AS item_name, cus.phone_no AS phone_no, soi.qty AS so_qty,
            CASE
                WHEN (SELECT COUNT(*) FROM `tabPurchase Order Item` poi WHERE poi.sales_order_item_cf = soi.name) >= 1 THEN 'Yes'
                ELSE 'No'
            END AS po_created,
            (SELECT GROUP_CONCAT(DISTINCT poi.parent) FROM `tabPurchase Order Item` poi WHERE poi.sales_order_item_cf = soi.name) AS po_no,
            (SELECT 
                CASE
                    WHEN SUM(poi.stock_qty) != SUM(poi.received_qty) AND SUM(poi.received_qty) = 0 THEN 'No'
                    WHEN SUM(poi.stock_qty) != SUM(poi.received_qty) THEN 'Partial'
                    WHEN SUM(poi.stock_qty) = SUM(poi.received_qty) THEN 'Yes'
                    ELSE ''
                END
            FROM `tabPurchase Order Item` poi WHERE poi.sales_order_item_cf = soi.name
            GROUP BY poi.sales_order_item_cf) AS material_receiving,
            sum(wo.produced_qty) AS produced_qty, (sum(wo.qty) - sum(wo.produced_qty)) AS under_process_qty, soi.delivered_qty AS delivered_qty,(soi.qty - soi.delivered_qty) AS to_deliver_qty
        FROM
            `tabSales Order` so
        INNER JOIN
            `tabSales Order Item` soi ON so.name = soi.parent
        INNER JOIN
            `tabCustomer` cus ON so.customer = cus.name
        LEFT JOIN
            `tabWork Order` wo ON so.name = wo.sales_order
        WHERE
            1=1
            {0}
        group by soi.name
        """.format(conditions)

    entries = frappe.db.sql(query, filters, as_dict=True)
    return entries

def get_conditions(filters):
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