frappe.ui.form.on('Purchase Order', {
	refresh:function(frm) {
		frm.add_custom_button("Sales Order",function(){
            if (!frm.doc.supplier) {
				frappe.msgprint("Select a Supplier first before getting items from Sales Order");
				return;
			}
            erpnext.utils.map_current_doc({
                method: "sw.make_sales_order.make_sales_order",
                source_doctype: "Sales Order",
                target: frm.doc,
                setters: {
                    customer: frm.doc.customer,
                    transaction_date: frm.doc.transaction_date
                },
                get_query_filters: {
                    docstatus: 1,
                    status: ["not in", ["Stopped", "Expired"]],
                }
            })
		},"Get Items From");
	}
})