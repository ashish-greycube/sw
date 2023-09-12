frappe.ui.form.on('Sales Order', {
    // if frm is not new & if CM is not linked with SO then create CM button else remove button 
    refresh: function(frm){
        if (!frm.is_new()) {

            frappe.db.get_list('Customer Measurement', {
                fields: ['name', 'so_reference_cf'],
                filters: {
                    so_reference_cf: frm.doc.name
                },
                limit: 1
            }).then(records => {
                if (records && records.length > 0) {
                    frm.remove_custom_button("Create Measurement");
                }
                else {
                        frm.add_custom_button("Create Measurement", function () {
                            frappe.new_doc("Customer Measurement", {
                                customer: frm.doc.customer,
                                so_reference_cf: frm.doc.name,

                            }).then(function (doc) {
                                frappe.set_route("Form", "Customer Measurement", doc.name);
                            });
                        });

                    }
            });
        }
    },
    //once create SO from QTN, and add date then after save SO, if that SO has QTN name in child table's first row 
    // then if QTN has CM linked then update that CM with SO name 

    after_save: function(frm){
        if(frm.doc.items && frm.doc.items[0] && frm.doc.items[0].prevdoc_docname){
            frappe.db.get_list('Customer Measurement', {
                                fields: ['name','so_reference_cf'],
                                filters: {
                                    qtn_reference_cf: frm.doc.items[0].prevdoc_docname
                                }
            }).then(records=>{
                if (records && records[0] && records[0].so_reference_cf==null) {
                    frappe.call({
                                    method: "sw.sales_order_checkcm.update_customer_measurement",
                                    args: {
                                        cm_docname: records[0].name,
                                        so_reference_cf: frm.doc.name
                                    },
                                    callback: function (r) {
                                            if (r.message) {
                                                frappe.show_alert('Customer Measurement document ' +  records[0].name + ' updated with SO reference: ' + frm.doc.name);
                                            } else {
                                                frappe.show_alert('Failed to update Customer Measurement document.');
                                            }
                                        }
                                    })
                }

            })
  
        }
    }
})