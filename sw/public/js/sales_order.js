frappe.ui.form.on('Sales Order', {
    refresh: function(frm) {

        //check in child item for qtn, if it has CM linked or not 
       
        frm.doc.items.forEach(function(row) {
           
            if (row.prevdoc_docname) {
                frappe.call({
                    method: "sw.sales_order_checkcm.check_customer_measurement",
                    args: {
                        'qtn_reference_cf': row.prevdoc_docname
                    },
                    callback: function(response) {
                        if (response.message) {
                            
                            hideCustomerMeasurementButton(frm);

                            // Save the Customer Measurement document with updated so_reference
                            if (!frm.is_new()) {
                                console.log("frm is new");
                                frappe.call({
                                    method: "sw.sales_order_checkcm.update_customer_measurement",
                                    args: {
                                        cm_docname: response.message,
                                        so_reference_cf: frm.doc.name
                                    },
                                    callback: function(update_response) {
                                        if (update_response.message) {
                                        // Show the alert only once
                                            if (!frm._cm_update_alert_shown) {
                                                frappe.show_alert('Customer Measurement document ' + response.message + ' updated with SO reference: ' + frm.doc.name);
                                                frm._cm_update_alert_shown = true;
                                            } 
                                        }
                                        else {
                                            frappe.show_alert('Failed to update Customer Measurement document.');
                                        }
                                    }
                                });
                            }

                        } else {
                            
                            showCustomerMeasurementButton(frm);
                        }
                    }
                });
            } else {
                showCustomerMeasurementButton(frm);
            }
        });
    }
});

function hideCustomerMeasurementButton(frm) {
   
    frm.remove_custom_button('Customer Measurement');
}

function showCustomerMeasurementButton(frm) {

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Customer Measurement',
            filters: { so_reference_cf: frm.doc.name },
            limit: 1,
        },
        callback: function (r) {
            if (r.message && r.message.length > 0) {
                frm.remove_custom_button('Create Measurement');
            } else {

                if (!frm.is_new()){

                    frm.add_custom_button(__('Create Measurement'), function () {
                        frappe.new_doc('Customer Measurement', {
                            customer: frm.doc.customer,
                            so_reference_cf: frm.doc.name,
                        }).then(function (doc) {
                            frappe.set_route('Form', 'Customer Measurement', doc.name);
                        });
                    });
                }
            }
        },
    });
}
