frappe.ui.form.on('Sales Order', {
    // if frm is not new & if CM is not linked with SO then create CM button else remove button 
    refresh: function(frm){
        if (!frm.is_new()) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Customer Measurement',
                    filters: {
                        so_reference_cf: frm.doc.name
                    },
                    limit: 1,
                },
                callback: function (r) {
                    if (r.message && r.message.length > 0) {
                        frm.remove_custom_button("Create Measurement");
                    } else {
                        frm.add_custom_button("Create Measurement", function () {
                            frappe.new_doc("Customer Measurement", {
                                customer: frm.doc.customer,
                                so_reference_cf: frm.doc.name,

                            }).then(function (doc) {
                                frappe.set_route("Form", "Customer Measurement", doc.name);
                            });
                        });

                    }
                }
            });
        }
    },
    //once create SO from QTN, and add date then after save SO, if that SO has QTN name in child table's first row 
    // then if QTN has CM linked then update that CM with SO name 

    after_save: function(frm){
        if(!frm.is_new() && frm.doc.items && frm.doc.items[0] && frm.doc.items[0].prevdoc_docname){
            frappe.db.get_list('Customer Measurement', {
                                fields: ['name'],
                                filters: {
                                    qtn_reference_cf: frm.doc.items[0].prevdoc_docname
                                }
            }).then(records=>{
                console.log("Quotation with linked CM found. So update so field in CM");
                // frappe.msgprint("Update CM");

                if (records[0] && records[0].so_reference_cf==null) {
                    console.log("calling function to update cm");

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
                // else if(records[0] && records[0].so_reference_cf!==null){
                //     frappe.msgprint("CM Already updated earlier");
                // }

            })

            
        }
    }
})
















// sir code
// frappe.ui.form.on('Sales Order', {
//     after_save: function (frm) {
//         if (!frm.is_new() && frm.doc.items && frm.doc.items[0] && frm.doc.items[0].prevdoc_docname) {
//             frappe.db.get_list('Customer Measurement', {
//                 fields: ['name','so_reference_cf'],
//                 filters: {
//                     qtn_reference_cf: frm.doc.items[0].prevdoc_docname
//                 }
//             }).then(records => {
//                 console.log('11',records,records[0].so_reference_cf==null)
//                 if (records && records[0] && records[0].so_reference_cf==null) {
//                     frappe.call({
//                         method: "sw.sales_order_checkcm.update_customer_measurement",
//                         args: {
//                             cm_docname: records[0].name,
//                             so_reference_cf: frm.doc.name
//                         },
//                         callback: function (update_response) {
//                             if (update_response.message) {
//                                 // Show the alert only once
//                                 frappe.show_alert('Customer Measurement document ' +  records[0].name + ' updated with SO reference: ' + frm.doc.name);
//                             } else {
//                                 frappe.show_alert('Failed to update Customer Measurement document.');
//                             }
//                         }
//                     });
//                 }
//             })
//         }
//     },
//     refresh: function (frm) {
//         if (!frm.is_new() && frm.doc.items && frm.doc.items[0] && frm.doc.items[0].prevdoc_docname) {
//             frappe.db.get_list('Customer Measurement', {
//                 fields: ['name','so_reference_cf'],
//                 filters: {
//                     qtn_reference_cf: frm.doc.items[0].prevdoc_docname
//                 }
//             }).then(records => {
//                 console.log('11',records,records[0].so_reference_cf==null)
//                 if (records && records[0] && records[0].so_reference_cf) {
//                     hideCustomerMeasurementButton(frm);
//                 } else if (records && records[0] && records[0].so_reference_cf==null) {
//                     // do nothing
//                 }
//             })
//         } else if (!frm.is_new() && frm.doc.items && frm.doc.items[0] && frm.doc.items[0].prevdoc_docname==undefined) {
//             showCustomerMeasurementButton(frm);
//         }

//     }
// })









// my previos code

// frappe.ui.form.on('Sales Order', {
//     refresh: function (frm) {
//         if (!frm.is_new()) {

//                 if (frm.doc.items && frm.doc.items[0] && frm.doc.items[0].prevdoc_docname) {
//                     frappe.call({
//                         method: "sw.sales_order_checkcm.check_customer_measurement",
//                         args: {
//                             'qtn_reference_cf': frm.doc.items[0].prevdoc_docname
//                         },
//                         callback: function (response) {
//                             if (response.message) {

//                                 hideCustomerMeasurementButton(frm);

//                                 // Save the Customer Measurement document with updated so_reference

//                                 frappe.call({
//                                     method: "sw.sales_order_checkcm.update_customer_measurement",
//                                     args: {
//                                         cm_docname: response.message,
//                                         so_reference_cf: frm.doc.name
//                                     },
//                                     callback: function (update_response) {
//                                         if (update_response.message) {
//                                             // Show the alert only once
//                                                 frappe.show_alert('Customer Measurement document ' + response.message + ' updated with SO reference: ' + frm.doc.name);
//                                         } else {
//                                             frappe.show_alert('Failed to update Customer Measurement document.');
//                                         }
//                                     }
//                                 });


//                             } else {

//                                 showCustomerMeasurementButton(frm);
//                             }
//                         }
//                     });
//                 } else {
//                     showCustomerMeasurementButton(frm);
//                 }

//         }
//     }
// });

function hideCustomerMeasurementButton(frm) {

    frm.remove_custom_button('Create Measurement');
}

function showCustomerMeasurementButton(frm) {

    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Customer Measurement',
            filters: {
                so_reference_cf: frm.doc.name
            },
            limit: 1,
        },
        callback: function (r) {
            if (r.message && r.message.length > 0) {
                frm.remove_custom_button('Create Measurement');
            } else {
                frm.add_custom_button(__('Create Measurement'), function () {
                    frappe.new_doc('Customer Measurement', {
                        customer: frm.doc.customer,
                        so_reference_cf: frm.doc.name,
                    }).then(function (doc) {
                        frappe.set_route('Form', 'Customer Measurement', doc.name);
                    });
                });
            }
        },
    });
}