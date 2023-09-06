frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {
       
        frm.doc.items.forEach(function(row) {
           
            if (row.prevdoc_docname) {
                frappe.call({
                    method: "sw.sales_order_checkcm.check_customer_measurement",
                    args: {
                        'qtn_reference': row.prevdoc_docname
                    },
                    callback: function(response) {
                        if (response.message) {
                            
                            frappe.show_alert('Linked Customer Measurement document found for row ' + row.idx + ': ' + row.prevdoc_docname + ', Document Name: ' + response.message);
                            hideCustomerMeasurementButton(frm);
                        } else {
                            
                            frappe.show_alert('No linked Customer Measurement document found for row ' + row.idx + ': ' + row.prevdoc_docname);
                            showCustomerMeasurementButton(frm);
                        }
                    }
                });
            } else {
                frappe.show_alert('No Quotation document linked to this row ' + row.idx);
                showCustomerMeasurementButton(frm);
            }
        });
    }
});

function hideCustomerMeasurementButton(frm) {
   
    frm.remove_custom_button('Customer Measurement');
}

function showCustomerMeasurementButton(frm) {

    // frm.add_custom_button(__('Customer Measurement'), function() {
    //     frappe.new_doc("Customer Measurement", {
    //         customer: frm.doc.customer,
    //         so_reference: frm.doc.name,
            
    //     }).then(function(doc) {
    //         frappe.set_route("Form", "Customer Measurement", doc.name);
    //     });
    // });



    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Customer Measurement',
            filters: { so_reference: frm.doc.name },
            limit: 1,
        },
        callback: function (r) {
            if (r.message && r.message.length > 0) {
                frm.remove_custom_button('Customer Measurement');
            } else {
                frm.add_custom_button(__('Customer Measurement'), function () {
                    frappe.new_doc('Customer Measurement', {
                        customer: frm.doc.customer,
                        so_reference: frm.doc.name,
                    }).then(function (doc) {
                        frappe.set_route('Form', 'Customer Measurement', doc.name);
                    });
                });
            }
        },
    });
}
